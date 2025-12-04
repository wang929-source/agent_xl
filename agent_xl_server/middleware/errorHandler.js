/**
 * @description 统一错误处理中间件
 * 捕获并处理应用程序中的各种错误
 */

import { formatErrorResponse, formatBadRequestResponse } from '../utils/responseFormatter.js';

/**
 * 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 */
function errorHandler(err, req, res, next) {
  // 默认错误状态码和消息
  let statusCode = 500;
  let message = '服务器内部错误';
  
  // 处理不同类型的错误
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(formatBadRequestResponse('请求体格式错误'));
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = '请求体过大';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = '上传文件过大';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(formatBadRequestResponse('不允许的文件字段'));
  } else if (err.message && err.message.includes('ER_DUP_ENTRY')) {
    statusCode = 409;
    message = '数据重复';
  } else if (err.message) {
    message = err.message;
  }
  
  // 记录错误日志
  console.error(`${new Date().toISOString()} - ${req.method} ${req.path} - ${message}`);
  console.error(err.stack);
  
  // 发送错误响应
  res.status(statusCode).json(formatErrorResponse(message, statusCode));
}

export default errorHandler;