# 部署指南

## 环境变量配置

项目支持通过环境变量灵活配置上传目录和API地址：

### 本地开发环境
使用 `.env` 文件：
```env
VITE_UPLOAD_DIR=src/img
VITE_API_BASE_URL=http://localhost:3001
```

### 远端服务器部署
使用 `.env.production` 文件：
```env
VITE_UPLOAD_DIR=/data/agent_xl_server/uploads
VITE_API_BASE_URL=http://192.168.2.225:3001
```

### 多环境配置示例
```env
# 开发环境 (.env.development)
VITE_UPLOAD_DIR=src/img
VITE_API_BASE_URL=http://localhost:3001

# 测试环境 (.env.test)
VITE_UPLOAD_DIR=/data/test/uploads
VITE_API_BASE_URL=http://192.168.2.100:3001

# 生产环境 (.env.production)
VITE_UPLOAD_DIR=/data/agent_xl_server/uploads
VITE_API_BASE_URL=http://192.168.2.225:3001
```

## 部署步骤

### 1. 前端部署
```bash
# 构建生产版本
npm run build

# 或者指定环境文件
vite build --mode production
```

### 2. 后端配置
确保后端服务支持：
- 接收 `uploadDir` 参数来指定文件上传目录
- 正确处理不同路径格式的图片访问

### 3. 路径适配逻辑
代码会自动处理以下路径格式：
- 完整URL：`http://example.com/image.png`
- 相对路径：`src/img/image.png` 或 `/src/img/image.png`
- 新路径格式：`/data/agent_xl_server/uploads/image.png`
- 默认路径：自动补全到配置的UPLOAD_DIR

## 注意事项

1. **环境变量前缀**：Vite要求环境变量必须以 `VITE_` 开头
2. **构建时注入**：环境变量在构建时注入，修改后需要重新构建
3. **后端兼容性**：确保后端API支持新的上传目录配置