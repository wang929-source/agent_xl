/**
 * @description 日志工具模块
 * 提供统一的日志记录功能
 */

/**
 * 记录信息日志
 * @param {string} message - 日志消息
 * @param {...any} args - 附加参数
 */
function info(message, ...args) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
}

/**
 * 记录错误日志
 * @param {string} message - 错误消息
 * @param {...any} args - 附加参数
 */
function error(message, ...args) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
}

/**
 * 记录警告日志
 * @param {string} message - 警告消息
 * @param {...any} args - 附加参数
 */
function warn(message, ...args) {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
}

/**
 * 记录调试日志
 * @param {string} message - 调试消息
 * @param {...any} args - 附加参数
 */
function debug(message, ...args) {
  console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
}

export { info, error, warn, debug };