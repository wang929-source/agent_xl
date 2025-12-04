// API基础配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_PREFIX = `${API_BASE_URL}/api`
export const API_TIMEOUT = 10000
export const PAGE_SIZE = 20;

// 上传目录配置
export const UPLOAD_DIR = import.meta.env.VITE_UPLOAD_DIR