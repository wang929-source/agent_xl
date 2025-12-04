# Agent XL Docker化部署指南

## 一、部署前准备

### 1. 环境要求
- Docker 19.03+ 和 Docker Compose 3.8+
- 至少 2GB RAM 和 10GB 磁盘空间

### 2. 目录结构
```
agent_xl/
├── agent_xl_fe/          # 前端项目
│   ├── Dockerfile        # 前端Docker配置
│   ├── .env              # 前端环境变量
│   └── ...
├── agent_xl_server/      # 后端项目
│   ├── Dockerfile        # 后端Docker配置
│   ├── .env              # 后端环境变量
│   └── ...
├── docker-compose.yml    # Docker Compose配置
└── DEPLOYMENT_GUIDE.md   # 本部署指南
```

## 二、部署配置

### 1. 环境变量配置

#### 前端环境变量 (agent_xl_fe/.env)
```env
# 上传目录配置
VITE_UPLOAD_DIR=data/agent_xl_server/uploads/

# API基础URL
VITE_API_BASE_URL=http://localhost:3001
```

#### 后端环境变量 (agent_xl_server/.env)
```env
# 服务器端口
PORT=3001

# MySQL数据库配置
DB_HOST=database
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=agent_xl
```

### 2. Docker Compose配置说明

主要服务包括：
- **backend**: Node.js后端服务，端口3001
- **frontend**: Nginx前端服务，端口80
- **database**: MySQL数据库服务，端口3306

数据持久化：
- 数据库数据通过Docker卷`mysql_data`持久化
- 上传的文件通过挂载目录`./agent_xl_server/src/img:/app/src/img`持久化

## 三、部署步骤

### 1. 构建并启动所有服务

```bash
# 进入项目根目录
cd f:\agent_xl

# 构建并启动服务（-d表示后台运行）
docker-compose up -d
```

### 2. 查看服务状态

```bash
docker-compose ps
```

### 3. 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志（例如后端）
docker-compose logs backend

# 实时查看日志
docker-compose logs -f backend
```

### 4. 停止服务

```bash
# 停止服务但保留容器和数据
docker-compose stop

# 停止并删除容器（数据仍然保留）
docker-compose down

# 停止并删除容器和数据卷
docker-compose down -v
```

### 5. 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

## 四、访问应用

部署完成后，可以通过以下地址访问应用：

- **前端应用**: `http://localhost`
- **后端API**: `http://localhost:3001`
- **健康检查**: `http://localhost:3001/api/health`

## 五、常见问题及解决方案

### 1. 服务启动失败

查看日志找出问题：
```bash
docker-compose logs -f
```

### 2. 数据库连接失败

确保：
- 数据库服务已正常启动
- 环境变量中的数据库配置正确
- 网络连接正常

### 3. 前端无法访问后端API

检查：
- 后端服务是否正常运行
- 前端环境变量`VITE_API_BASE_URL`配置是否正确
- CORS配置是否允许跨域请求

### 4. 文件上传问题

确保：
- 上传目录权限正确
- 挂载目录配置正确
- 文件大小限制配置正确

## 六、更新应用

### 1. 更新代码后重新构建

```bash
# 进入项目根目录
cd f:\agent_xl

# 重新构建并启动服务
docker-compose up -d --build
```

### 2. 仅更新特定服务

```bash
# 重新构建并启动后端服务
docker-compose up -d --build backend
```

## 七、生产环境建议

1. **安全性**：
   - 更改默认密码
   - 配置SSL证书
   - 限制访问IP

2. **性能**：
   - 根据实际需求调整资源限制
   - 配置Nginx缓存
   - 优化数据库查询

3. **监控**：
   - 配置日志收集
   - 监控服务状态
   - 设置告警机制

4. **备份**：
   - 定期备份数据库
   - 定期备份上传文件
   - 制定灾难恢复计划
