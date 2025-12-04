#!/bin/bash
# 启动整个应用程序脚本

# 进入项目根目录
cd "$(dirname "$0")"

echo "正在启动应用程序..."

# 构建并启动所有服务
docker-compose up -d --build

echo "应用程序启动中，请稍候..."

# 等待5秒钟让服务启动
sleep 5

echo "服务状态："
docker-compose ps

echo "前端访问地址：http://localhost:80"
echo "后端API地址：http://localhost:3001"
