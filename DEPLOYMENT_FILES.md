# 前后端项目部署文件清单

本文档列出了将前后端项目部署到远端服务器时需要上传的文件和目录。

## 一、项目根目录

需要上传以下文件：

| 文件/目录 | 说明 |
|---------|------|
| `docker-compose.yml` | Docker Compose配置文件，用于协调前后端服务和数据库 |
| `start.sh` | 项目启动脚本，一键启动所有服务 |

## 二、前端项目目录 (agent_xl_fe)

需要上传以下文件和目录：

| 文件/目录 | 说明 |
|---------|------|
| `.env` | 开发环境配置文件 |
| `.env.production` | 生产环境配置文件 |
| `.gitignore` | Git忽略文件配置 |
| `Dockerfile` | 前端Docker构建配置（多阶段构建） |
| `package.json` | 前端项目依赖配置 |
| `package-lock.json` | 前端依赖锁定文件 |
| `public/` | 静态资源目录，包含默认图片等 |
| `src/` | 前端源代码目录 |
| `vite.config.js` | Vite构建配置文件 |
| `build.sh` | 前端构建脚本（可选，Docker构建会自动执行构建） |

**不需要上传的文件和目录：**
- `node_modules/`：依赖目录，Docker构建时会自动安装
- `dist/`：编译后的文件，Docker构建时会自动生成
- 编辑器配置文件（.vscode/, .idea/等）
- 日志文件（*.log）

## 三、后端项目目录 (agent_xl_server)

需要上传以下文件和目录：

| 文件/目录 | 说明 |
|---------|------|
| `.env` | 开发环境配置文件 |
| `.env.example` | 环境变量示例文件 |
| `.gitignore` | Git忽略文件配置 |
| `Dockerfile` | 后端Docker构建配置 |
| `package.json` | 后端项目依赖配置 |
| `package-lock.json` | 后端依赖锁定文件 |
| `config/` | 数据库等配置目录 |
| `middleware/` | 中间件目录 |
| `routes/` | API路由目录 |
| `server.js` | 后端服务器入口文件 |
| `src/` | 后端源代码目录（包含图片上传目录） |
| `start.sh` | 后端启动脚本 |
| `utils/` | 工具函数目录 |

**不需要上传的文件和目录：**
- `node_modules/`：依赖目录，Docker构建时会自动安装
- `test/`：测试目录（可选，如果不需要测试可以不上传）
- 编辑器配置文件
- 日志文件

## 四、部署步骤

1. 将上述文件和目录上传到远端服务器的同一目录下（如`/opt/agent_xl/`）
2. 进入项目根目录：`cd /opt/agent_xl/`
3. 确保Docker和Docker Compose已安装
4. 执行启动命令：`bash start.sh` 或 `docker-compose up -d --build`
5. 等待服务构建并启动完成

## 五、使用编译后文件部署的文件清单

如果您已经在本地编译了前端项目（执行了`npm run build`命令，生成了`dist`目录），可以使用以下文件清单进行部署：

### 5.1 项目根目录

需要上传以下文件：

| 文件/目录 | 说明 |
|---------|------|
| `docker-compose.yml` | Docker Compose配置文件 |
| `start.sh` | 项目启动脚本 |

### 5.2 前端项目目录 (agent_xl_fe)

**只需要上传以下文件和目录：**

| 文件/目录 | 说明 |
|---------|------|
| `.env.production` | 生产环境配置文件 |
| `Dockerfile.production` | （需创建）前端生产环境Docker配置（直接使用编译后文件） |
| `dist/` | **编译后的前端静态资源目录**（包含所有需要的HTML、CSS、JS和图片文件） |

### 5.3 后端项目目录 (agent_xl_server)

需要上传的文件与之前相同（完整的后端项目）。

### 5.4 创建前端生产环境Dockerfile

需要创建`Dockerfile.production`文件，内容如下：

```dockerfile
# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 删除默认 nginx 网站内容
RUN rm -rf /usr/share/nginx/html/*

# 直接拷贝本地已编译好的前端资源
COPY dist/ /usr/share/nginx/html/

# 默认使用 80 端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 5.5 修改docker-compose.yml

需要修改前端服务的构建配置，使用生产环境Dockerfile：

```yaml
# 前端服务
frontend:
  build:
    context: ./agent_xl_fe
    dockerfile: Dockerfile.production
  container_name: agent_xl_frontend
  ports:
    - "80:80"
  depends_on:
    - backend
  restart: unless-stopped
```

## 六、注意事项

1. 确保远端服务器已安装Docker和Docker Compose
2. 环境变量文件（.env）中的配置需要根据实际服务器环境进行调整
3. 如果使用自定义域名，需要配置Nginx反向代理
4. 定期备份数据库数据和上传的图片文件
5. 使用编译后文件部署时，确保dist目录包含了所有必要的静态资源

按照上述清单上传文件，即可在远端服务器上成功部署前后端应用。