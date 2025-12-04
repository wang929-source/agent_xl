# Agent XL Backend API Server

这是一个基于 Node.js 和 Express 的后端服务，提供智能体卡片数据的管理 API。

## 更新日志

### 2024-05-22
- 实现统一的API响应格式
- 创建独立的响应格式化工具模块 (`utils/responseFormatter.js`)
- 更新所有API端点以使用统一的响应格式
- 更新错误处理中间件以使用统一的响应格式
- 更新测试文件以适配新的响应格式

### 2024-05-23
- 添加400状态码的专门处理函数
- 更新相关模块以使用新的400状态码处理函数

## 功能特性

- 提供智能体卡片数据的增删改查接口
- 支持文件上传功能（Logo 图片）
- RESTful API 设计
- 统一的API响应格式
- MySQL 数据库存储
- CORS 跨域支持
- 模块化代码结构，易于维护和扩展

## 技术栈

- Node.js v14+
- Express.js
- MySQL 8.0+
- Multer (文件上传)
- dotenv (环境配置)

## 统一API响应格式

为了提供一致的API体验，所有API端点都使用统一的响应格式：

### 成功响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 列表响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [],
  "total": 0
}
```

### 错误响应格式
```json
{
  "code": 500,
  "message": "服务器内部错误"
}
```

### 客户端错误响应格式（400 Bad Request）
```json
{
  "code": 400,
  "message": "请求参数错误"
}
```

### 删除响应格式
对于成功的删除操作，API将返回HTTP状态码204（No Content），无响应体。

## 项目结构

```
agent_xl_server/
├── config/              # 配置文件目录
│   └── database.js      # 数据库配置模块
├── middleware/          # 中间件目录
│   └── errorHandler.js  # 统一错误处理中间件
├── routes/              # 路由目录
│   ├── cards.js         # 智能体卡片管理路由
│   └── upload.js        # 文件上传路由
├── utils/               # 工具函数目录
│   └── logger.js        # 日志工具模块
├── uploads/             # 上传文件存储目录
├── .env.example         # 环境变量配置示例
├── server.js            # 应用入口文件
└── package.json         # 项目依赖配置
```

## 环境变量配置

项目使用环境变量来管理配置，可通过 `.env` 文件进行设置：

```env
# 服务器端口
PORT=3001

# MySQL数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=agent_xl_db

# 上传文件目录配置
# 本地开发环境默认使用项目目录下的 uploads
# 生产环境可设置为 /data/agent_xl_server/uploads
# UPLOAD_DIR=./uploads
```

## API 接口

### 获取所有卡片
```
GET /api/cards
```

### 根据类型获取卡片
```
GET /api/cards/type/:type
```

### 创建新卡片
```
POST /api/cards
```

### 编辑指定卡片
```
PUT /api/cards/:id
```

### 更新卡片URL
```
PUT /api/cards/:id/url
```

### 删除卡片
```
DELETE /api/cards/:id
```

### 上传Logo
```
POST /api/upload-logo
```

上传Logo接口会返回文件的访问路径，前端应该使用这个路径来创建或更新智能体卡片。

### 健康检查
```
GET /api/health
```

## 部署说明

### 本地开发环境

1. 安装依赖：
   ```bash
   npm install
   ```

2. 复制 `.env.example` 为 `.env` 并配置相应参数：
   ```bash
   cp .env.example .env
   ```

3. 启动服务：
   ```bash
   npm start
   ```

### 生产环境部署

1. 上传项目文件到服务器

2. 安装依赖：
   ```bash
   npm install
   ```

3. 复制 `.env.example` 为 `.env` 并配置相应参数：
   ```bash
   cp .env.example .env
   ```

4. 配置环境变量，特别是设置上传目录：
   ```env
   UPLOAD_DIR=/data/agent_xl_server/uploads
   ```

5. 创建上传目录并确保有适当的权限：
   ```bash
   mkdir -p /data/agent_xl_server/uploads
   chown -R www-data:www-data /data/agent_xl_server/uploads
   ```

6. 使用 PM2 管理进程（推荐）：
   ```bash
   npm install -g pm2
   pm2 start server.js --name "agent-xl-backend"
   pm2 startup
   pm2 save
   ```

7. 配置防火墙允许相应端口访问

## 灵活的上传路径配置

为了适应不同部署环境的需求，项目支持通过环境变量 `UPLOAD_DIR` 来配置上传文件的存储路径：

- 本地开发环境：默认使用项目目录下的 `uploads`
- 生产环境：可以设置为 `/data/agent_xl_server/uploads` 或其他路径

只需在 `.env` 文件中设置 `UPLOAD_DIR` 变量即可：
```env
UPLOAD_DIR=/data/agent_xl_server/uploads
```

无论部署到哪个服务器，都可以通过修改这个环境变量来适应不同的目录结构要求。