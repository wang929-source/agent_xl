# 使用官方 Node.js 18 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --only=production

# 复制项目文件
COPY . .

# 设置环境变量（默认值，可通过.env文件覆盖）
ENV NODE_ENV=production
ENV UPLOAD_DIR=/data/agent_xl_server/uploads

# 确保启动脚本具有可执行权限
RUN chmod +x start.sh

# 暴露端口
EXPOSE 3001

# 使用启动脚本启动服务
CMD ["./start.sh"]
