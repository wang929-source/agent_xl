/**
 * @description 文件上传路由模块
 * 提供Logo文件上传功能
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { formatResponse, formatErrorResponse, formatBadRequestResponse } from '../utils/responseFormatter.js';

// 加载环境变量
dotenv.config();

// 设置API基础URL，用于构建完整的文件访问链接
// 使用BASE_URL环境变量，与.env文件保持一致
const BASE_URL = process.env.BASE_URL || '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置上传目录，优先使用环境变量中的配置，否则使用默认路径
const UPLOAD_DIR = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR) 
  : path.join(__dirname, '..', 'uploads');

// 确保上传目录存在
import fs from 'fs';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 使用时间戳+原始文件名确保唯一性
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器 - 只允许图片文件
const fileFilter = (req, file, cb) => {
  // 检查文件类型是否为图片
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
  }
});

const router = express.Router();

/**
 * POST /api/upload-logo
 * 上传Logo文件
 */
router.post('/upload-logo', upload.single('logo'), (req, res) => {
  try {
    // 检查是否有文件上传
    if (!req.file) {
      return res.status(400).json(formatBadRequestResponse('请上传Logo文件'));
    }

    // 返回上传成功的文件信息，包含完整URL
    // 确定上传目录的URL路径部分
    const uploadDirPath = process.env.UPLOAD_DIR
      ? process.env.UPLOAD_DIR.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/')
      : 'uploads';
    // 构建完整的LOGO URL，与cards.js中的buildLogoUrl函数保持一致
    const fullUrl = `${BASE_URL.replace(/\/$/g, '')}/${uploadDirPath}/${req.file.filename}`;
    
    const fileInfo = {
      filename: req.file.filename,
      path: fullUrl,
      size: req.file.size
    };
    
    res.status(200).json(formatResponse(fileInfo, 'Logo上传成功'));
  } catch (error) {
    console.error('Logo上传失败:', error);
    res.status(500).json(formatErrorResponse('Logo上传失败'));
  }
});

export default router;