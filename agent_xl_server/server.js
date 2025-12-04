/**
 * @file server.js
 * @description Agent XL 后端服务主入口文件
 * 提供智能体卡片管理和文件上传API服务
 */

// 导入所需模块
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 导入自定义模块
import { testConnection } from './config/database.js';
import cardsRouter from './routes/cards.js';
import uploadRouter from './routes/upload.js';
import errorHandler from './middleware/errorHandler.js';
import { info, error } from './utils/logger.js';
import { formatResponse } from './utils/responseFormatter.js';

// 配置环境变量
dotenv.config();

// 获取__dirname的ES模块等效写法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
// 配置CORS以允许跨域请求
app.use(cors({
  origin: true, // 允许任何源
  credentials: true, // 允许携带凭证
  optionsSuccessStatus: 200 // 一些旧浏览器会出错，设置为200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 根据环境变量配置上传目录
const uploadDir = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR) 
  : path.join(__dirname, 'uploads');
// 使用与UPLOAD_DIR相同的路径作为静态文件服务的URL前缀
const staticUrlPath = process.env.UPLOAD_DIR 
  ? '/' + process.env.UPLOAD_DIR.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '') 
  : '/uploads';

// 为静态文件添加CORS头部，解决跨域图片访问问题
app.use(staticUrlPath, (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(uploadDir));

// API路由
app.use('/api', cardsRouter);
app.use('/api', uploadRouter);

/**
 * GET /api/health
 * 健康检查端点
 */
app.get('/api/health', (req, res) => {
  const healthData = { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Agent XL Backend API'
  };
  res.status(200).json(formatResponse(healthData, '健康检查成功'));
});

/**
 * 根路径 - API文档
 */
app.get('/', (req, res) => {
  const apiInfo = {
    message: '欢迎使用 Agent XL Backend API Server',
    version: '1.0.0',
    description: '智能体管理平台后端服务',
    api_endpoints: [
      'GET /api/cards - 获取所有智能体卡片列表',
      'GET /api/cards/type/:type - 根据类型获取智能体卡片列表',
      'POST /api/cards - 创建新卡片',
      'PUT /api/cards/:id - 编辑指定卡片',
      'PUT /api/cards/:id/url - 更新卡片URL',
      'DELETE /api/cards/:id - 删除指定卡片',
      'POST /api/upload-logo - 上传Logo',
      'GET /api/health - 健康检查'
    ],
    health_check: 'http://localhost:' + PORT + '/api/health'
  };
  res.json(formatResponse(apiInfo, 'API文档获取成功'));
});

// 全局错误处理中间件
app.use(errorHandler);

// 启动服务器函数
async function startServer() {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      error('数据库连接失败，服务器启动终止');
      process.exit(1);
    }
    
    // 启动Express服务器
    app.listen(PORT, () => {
      info(`Agent XL Backend API Server运行在端口 ${PORT}`);
      info(`API端点: http://localhost:${PORT}/api`);
      info(`健康检查: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    error('服务器启动失败:', err);
    process.exit(1);
  }
}

// 如果直接运行此文件，则启动服务器
// 简化启动逻辑，确保在各种环境下都能正常启动
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
} else if (!process.argv[1]) {
  // 当直接运行此文件时，process.argv[1] 应该是文件路径
  startServer();
}

export default app;