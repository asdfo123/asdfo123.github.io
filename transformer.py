"""
八股手写合集: Transformer / DDPM Diffusion / GRPO / Flow Matching
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
import math


# ============================================================
# 1. Transformer
# ============================================================

class MultiHeadAttention(nn.Module):
    """Multi-Head Self-Attention"""
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads
        self.Wq = nn.Linear(d_model, d_model)
        self.Wk = nn.Linear(d_model, d_model)
        self.Wv = nn.Linear(d_model, d_model)
        self.Wo = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, L, D = x.shape
        # 线性投影 + 拆头: (B, L, D) -> (B, H, L, d_k)
        Q = self.Wq(x).view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
        K = self.Wk(x).view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
        V = self.Wv(x).view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
        # Scaled Dot-Product Attention
        attn = Q @ K.transpose(-2, -1) / (self.head_dim ** 0.5)
        if mask is not None:
            attn = attn.masked_fill(mask == 0, float('-inf'))
        attn = torch.softmax(attn, dim=-1)
        # 加权求和 + 拼接 + 输出投影
        out = (attn @ V).transpose(1, 2).reshape(B, L, D)
        return self.Wo(out)


class FeedForward(nn.Module):
    """Position-wise FFN: Linear -> ReLU -> Linear"""
    def __init__(self, d_model, d_ff):
        super().__init__()
        self.fc1 = nn.Linear(d_model, d_ff)
        self.fc2 = nn.Linear(d_ff, d_model)

    def forward(self, x):
        return self.fc2(F.relu(self.fc1(x)))


class TransformerBlock(nn.Module):
    """Pre-Norm Transformer Block: LN -> MHA -> Residual -> LN -> FFN -> Residual"""
    def __init__(self, d_model, num_heads, d_ff):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, num_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = FeedForward(d_model, d_ff)

    def forward(self, x, mask=None):
        x = x + self.attn(self.ln1(x), mask)  # 残差 + MHA
        x = x + self.ffn(self.ln2(x))          # 残差 + FFN
        return x


# ============================================================
# 2. DDPM Diffusion (去噪扩散概率模型)
# ============================================================
# 核心公式:
#   前向加噪: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * eps
#   训练目标: MSE(eps, eps_theta(x_t, t))     预测噪声
#   反向去噪: x_{t-1} = (1/sqrt(alpha_t)) * (x_t - beta_t/sqrt(1-alpha_bar_t) * eps_theta) + sigma_t * z

class DDPM:
    """DDPM 扩散过程 (不含去噪网络, 只写调度+采样逻辑)"""
    def __init__(self, T=1000, beta_start=1e-4, beta_end=0.02):
        self.T = T
        # 线性噪声调度
        self.beta = torch.linspace(beta_start, beta_end, T)
        self.alpha = 1.0 - self.beta
        self.alpha_bar = torch.cumprod(self.alpha, dim=0)

    def q_sample(self, x_0, t, noise=None):
        """前向加噪: 从 x_0 一步到 x_t"""
        if noise is None:
            noise = torch.randn_like(x_0)
        alpha_bar_t = self.alpha_bar[t].view(-1, 1, 1, 1)  # (B,1,1,1)
        x_t = torch.sqrt(alpha_bar_t) * x_0 + torch.sqrt(1 - alpha_bar_t) * noise
        return x_t

    def train_loss(self, model, x_0):
        """训练: 随机采 t, 加噪, 预测噪声, 算 MSE"""
        B = x_0.shape[0]
        t = torch.randint(0, self.T, (B,), device=x_0.device)
        noise = torch.randn_like(x_0)
        x_t = self.q_sample(x_0, t, noise)
        pred_noise = model(x_t, t)
        return F.mse_loss(pred_noise, noise)

    @torch.no_grad()
    def p_sample(self, model, x_t, t):
        """反向去噪一步: x_t -> x_{t-1}"""
        beta_t = self.beta[t].view(-1, 1, 1, 1)
        alpha_t = self.alpha[t].view(-1, 1, 1, 1)
        alpha_bar_t = self.alpha_bar[t].view(-1, 1, 1, 1)
        pred_noise = model(x_t, t)
        mean = (1 / torch.sqrt(alpha_t)) * (x_t - beta_t / torch.sqrt(1 - alpha_bar_t) * pred_noise)
        if t.min() > 0:
            z = torch.randn_like(x_t)
            return mean + torch.sqrt(beta_t) * z
        return mean

    @torch.no_grad()
    def sample(self, model, shape):
        """完整采样: 从纯噪声 x_T 逐步去噪到 x_0"""
        x = torch.randn(shape)
        for t in reversed(range(self.T)):
            t_batch = torch.full((shape[0],), t, dtype=torch.long)
            x = self.p_sample(model, x, t_batch)
        return x


# ============================================================
# 3. GRPO (Group Relative Policy Optimization)
# ============================================================
# DeepSeek 提出, PPO 的简化版:
#   - 不需要 Critic / Value 网络
#   - 每个 prompt 采样一组 (G 个) 回答, 用组内相对排名算 advantage
#   - 用 clipped surrogate objective + KL 惩罚
#
# 核心公式:
#   A_i = (r_i - mean(r)) / std(r)           组内相对优势
#   ratio = pi_theta / pi_old
#   L = min(ratio * A, clip(ratio, 1-eps, 1+eps) * A) - beta * KL

def grpo_loss(log_probs, old_log_probs, rewards, eps_clip=0.2, beta_kl=0.01):
    """
    GRPO 损失函数
    Args:
        log_probs:     当前策略 log π_θ(a|s),   shape (B, G)
        old_log_probs: 旧策略 log π_old(a|s),   shape (B, G)
        rewards:       每个回答的奖励分数,        shape (B, G)
    """
    # 1. 组内相对优势 (per-prompt normalize)
    mean_r = rewards.mean(dim=-1, keepdim=True)
    std_r = rewards.std(dim=-1, keepdim=True) + 1e-8
    advantage = (rewards - mean_r) / std_r

    # 2. 重要性采样比 ratio
    ratio = torch.exp(log_probs - old_log_probs)

    # 3. Clipped surrogate objective (同 PPO)
    surr1 = ratio * advantage
    surr2 = torch.clamp(ratio, 1 - eps_clip, 1 + eps_clip) * advantage
    policy_loss = -torch.min(surr1, surr2).mean()

    # 4. KL 散度惩罚 (替代 Critic baseline)
    kl = (old_log_probs - log_probs).mean()  # 近似 KL(old || new)
    loss = policy_loss + beta_kl * kl
    return loss


# ============================================================
# 4. Flow Matching (条件流匹配)
# ============================================================
# 核心思想: 学一个向量场 v_θ(x_t, t), 把噪声 x_0~N(0,I) 沿 ODE 推到数据 x_1
#
# 核心公式:
#   路径插值:  x_t = (1-t) * x_0 + t * x_1       (x_0 噪声, x_1 数据)
#   目标向量场: u_t = x_1 - x_0                    (条件最优传输)
#   训练目标:  MSE(v_θ(x_t, t), u_t)
#   采样: 用 ODE solver 从 x_0 积分到 x_1

class FlowMatching:
    """Conditional Flow Matching (OT path)"""

    @staticmethod
    def train_loss(model, x_1):
        """
        训练: 采样 t 和噪声, 算向量场回归损失
        Args:
            model: v_θ(x_t, t) 向量场网络
            x_1:   真实数据样本 (B, ...)
        """
        B = x_1.shape[0]
        # 采样 t ~ U(0,1) 和噪声 x_0 ~ N(0,I)
        t = torch.rand(B, device=x_1.device).view(B, *([1] * (x_1.dim() - 1)))
        x_0 = torch.randn_like(x_1)
        # 线性插值路径
        x_t = (1 - t) * x_0 + t * x_1
        # 目标向量场 = x_1 - x_0
        target = x_1 - x_0
        # 回归损失
        pred = model(x_t, t.squeeze())
        return F.mse_loss(pred, target)

    @staticmethod
    @torch.no_grad()
    def sample(model, shape, steps=100):
        """
        采样: Euler ODE solver, 从噪声 x_0 积分到 x_1
        """
        x = torch.randn(shape)                        # x_0 ~ N(0,I)
        dt = 1.0 / steps
        for i in range(steps):
            t = torch.full((shape[0],), i * dt, device=x.device)
            x = x + model(x, t) * dt                  # Euler 步进
        return x
