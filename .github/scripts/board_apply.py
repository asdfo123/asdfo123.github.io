#!/usr/bin/env python3
"""Apply a GenRender board update submitted as a GitHub issue.

Reads the issue body from $BODY and the author from $AUTHOR, validates the
payload, rewrites assign.json, and writes the reply to /tmp/board_comment.md.
Sets the step output ok=true only when assign.json was rewritten.
"""
import base64
import datetime
import json
import os
import pathlib
import re
import zlib

PATH = pathlib.Path("public/9fua131v7euj2bs2t2h2b6/genrender-board/assign.json")
COMMENT = pathlib.Path("/tmp/board_comment.md")
BOARD = "https://asdfo123.github.io/9fua131v7euj2bs2t2h2b6/genrender-board/#s7"
CHAPTERS = {
    "c1": "第1章 引言", "c2": "第2章 定义与框架", "c3": "第3章 驱动领域",
    "c4": "第4章 渲染器接口", "c5": "第5章 从注入到理解", "c6": "第6章 训练与数据",
    "c7": "第7章 流式与交互", "c8": "第8章 评测", "c9": "第9章 另一条路",
    "c10": "第10章 开放问题", "c11": "摘要与结论", "cA": "附录 A 总表",
}
LIMITS = {"id": 60, "name": 120, "fit": 400, "who": 300, "note": 4000}
MAX_JSON = 200_000


def output(ok):
    with open(os.environ.get("GITHUB_OUTPUT", "/dev/null"), "a") as f:
        f.write(f"ok={'true' if ok else 'false'}\n")


def reject(msg):
    COMMENT.write_text(f"没有应用这次更新：{msg}\n\n请回到 [分工面板]({BOARD}) 重新点「发布给所有人」。\n")
    output(False)
    raise SystemExit(0)


def decode(body):
    m = re.search(r"board-data:(gz|b64):([A-Za-z0-9+/=]+)", body or "")
    if not m:
        reject("issue 里找不到分工数据（不要改动提交页面里的内容）")
    try:
        raw = base64.b64decode(m.group(2), validate=True)
        if m.group(1) == "gz":
            d = zlib.decompressobj(16 + zlib.MAX_WBITS)
            raw = d.decompress(raw, MAX_JSON)
            if d.unconsumed_tail:
                reject("数据太大")
        if len(raw) > MAX_JSON:
            reject("数据太大")
        return json.loads(raw.decode("utf-8"))
    except SystemExit:
        raise
    except Exception:
        reject("分工数据损坏，无法解析")


def clean(state):
    if not isinstance(state, dict):
        reject("格式不对")
    pkgs, pool = state.get("pkgs"), state.get("pool")
    if not isinstance(pkgs, list) or not isinstance(pool, list) or len(pkgs) > 40:
        reject("格式不对")
    seen = set()

    def chapters(lst):
        if not isinstance(lst, list):
            reject("格式不对")
        for c in lst:
            if c not in CHAPTERS or c in seen:
                reject(f"章节编号不对或重复：{c!r}")
            seen.add(c)
        return lst

    out = []
    for p in pkgs:
        if not isinstance(p, dict):
            reject("格式不对")
        q = {}
        for k, lim in LIMITS.items():
            v = p.get(k, "")
            if not isinstance(v, str) or len(v) > lim:
                reject(f"字段 {k} 不合法或太长")
            q[k] = v
        q["ch"] = chapters(p.get("ch", []))
        if "shared" in p:
            q["shared"] = bool(p["shared"])
        out.append(q)
    pool = chapters(pool)
    pool += [c for c in CHAPTERS if c not in seen]
    return {"pkgs": out, "pool": pool}


def now_iso():
    t = datetime.datetime.now(datetime.timezone.utc)
    return t.strftime("%Y-%m-%dT%H:%M:%S.") + f"{t.microsecond // 1000:03d}Z"


def summary(state):
    lines, n = [], 0
    for p in state["pkgs"]:
        if not p.get("shared"):
            n += 1
        tag = "共担" if p.get("shared") else f"P{n}"
        chs = "、".join(CHAPTERS[c] for c in p["ch"]) or "（暂无）"
        lines.append(f"- **{tag} {p['name']}**｜负责人：{p['who'] or '待认领'}｜{chs}")
    if state["pool"]:
        lines.append("- 待认领：" + "、".join(CHAPTERS[c] for c in state["pool"]))
    return "\n".join(lines)


def main():
    payload = decode(os.environ.get("BODY", ""))
    if not isinstance(payload, dict) or payload.get("v") != 1:
        reject("格式不对")
    state = clean(payload.get("state"))
    prev = {}
    if PATH.exists():
        try:
            prev = json.loads(PATH.read_text(encoding="utf-8"))
        except Exception:
            prev = {}
    author = os.environ.get("AUTHOR", "")
    data = {"v": 1, "updated": now_iso(), "by": author, "state": state}
    PATH.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    note = ""
    if prev.get("updated") and payload.get("base") != prev.get("updated"):
        note = (f"\n\n注意：这次是在旧版本上改的，覆盖了 {prev.get('by') or '某人'} "
                f"在 {prev.get('updated')} 的发布。如有需要，可以在 [分工面板]({BOARD}) 上重新调整。")
    COMMENT.write_text(f"已发布，约 1 分钟后所有人刷新 [分工面板]({BOARD}) 就能看到。{note}\n\n"
                       f"{summary(state)}\n", encoding="utf-8")
    output(True)


if __name__ == "__main__":
    main()
