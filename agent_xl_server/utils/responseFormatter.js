/**
 * @description 统一API响应格式化工具
 * 提供标准化的RESTful API响应格式
 */

/**
 * @description 格式化成功响应
 * @param {*} data - 返回的数据
 * @param {string} message - 响应消息
 * @param {number} code - 状态码
 * @returns {Object} 格式化后的响应对象
 */
export const formatResponse = (data, message = '操作成功', code = 200) => {
  return { code, message, data };
};

/**
 * @description 格式化列表响应
 * @param {Array} data - 返回的数据列表
 * @param {number} total - 数据总数
 * @param {string} message - 响应消息
 * @param {number} code - 状态码
 * @returns {Object} 格式化后的响应对象
 */
export const formatListResponse = (data, total, message = '操作成功', code = 200) => {
  return { code, message, data, total };
};

/**
 * @description 格式化错误响应
 * @param {string} message - 错误消息
 * @param {number} code - 错误状态码
 * @returns {Object} 格式化后的错误响应对象
 */
export const formatErrorResponse = (message, code = 500) => {
  return { code, message };
};

/**
 * @description 格式化客户端错误响应（400 Bad Request）
 * @param {string} message - 错误消息
 * @param {number} code - 错误状态码，默认400
 * @returns {Object} 格式化后的错误响应对象
 */
export const formatBadRequestResponse = (message, code = 400) => {
  return { code, message };
};

/**
 * @description 格式化删除操作响应
 * @param {number} code - 状态码，默认204
 * @returns {Object} 格式化后的删除响应对象
 */
export const formatDeleteResponse = (code = 204) => {
  return { code };
};

export default {
  formatResponse,
  formatListResponse,
  formatErrorResponse,
  formatBadRequestResponse,
  formatDeleteResponse
};