# 使用官方 Ruby 镜像
FROM ruby:3.2

# 设置工作目录
WORKDIR /usr/src/app

# 复制项目文件到容器
COPY . .

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# 安装 Jekyll 和 Bundler
RUN gem install bundler jekyll

# 安装项目依赖
RUN bundle install

# 暴露 Jekyll 默认端口
EXPOSE 4000

# 启动 Jekyll 服务器
CMD ["bundle", "exec", "jekyll", "serve", "-H", "0.0.0.0", "-l"]