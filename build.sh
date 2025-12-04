#!/bin/bash
# 本地构建前端项目脚本

# 进入前端项目目录
cd "$(dirname "$0")"

echo "正在安装依赖..."
npm install

echo "正在构建项目..."
npm run build

echo "构建完成！"
ls -la dist/