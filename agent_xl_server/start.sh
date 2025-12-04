#!/bin/sh

# 确保上传目录存在并设置正确的权限
mkdir -p ${UPLOAD_DIR}
chown -R node:node ${UPLOAD_DIR}

# 启动应用
npm start
