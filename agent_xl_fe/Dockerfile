# 使用 Node.js 镜像作为构建阶段
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目代码
COPY . .

# 构建前端项目
RUN npm run build

# 使用 Nginx 作为生产阶段基础镜像
FROM nginx:alpine

# 删除默认 nginx 网站内容
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段拷贝编译后的前端资源
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# 默认使用 80 端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]