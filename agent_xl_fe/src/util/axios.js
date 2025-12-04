/**
 * @description 封装axios
 */
import axios from "axios";
import { API_PREFIX } from "./constant";

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: API_PREFIX,
    timeout: 1000000,
    // withCredentials: true, // 线下测试使用
    // responseType: 'json',
});

axiosInstance.interceptors.request.use((config) => {
    return config;
})

// 添加响应拦截器，统一处理后端响应格式
axiosInstance.interceptors.response.use(
    (response) => {
        // 处理204 No Content响应（删除操作成功时返回）
        if (response.status === 204) {
            return {
                code: 204, // 使用200表示成功
                message: '操作成功',
                data: null,
                total: 0
            };
        }
        
        // 后端返回的响应数据
        const responseData = response.data || {};
        const { code, message, data, total } = responseData;
        
        // 如果是成功响应 (code >= 200 && code < 300)
        if (code >= 200 && code < 300) {
            // 返回处理后的数据，保留原始响应结构
            return {
                code,
                message,
                data: data || null, // 确保data字段存在
                total: total || 0     // 确保total字段存在
            };
        } else {
            // 非成功状态码，抛出错误
            throw new Error(message || '请求失败');
        }
    },
    (error) => {
        // 处理网络错误或后端返回的错误响应
        if (error.response) {
            // 后端返回了错误响应
            const responseData = error.response.data || {};
            const { code, message } = responseData;
            console.error(`请求错误 (${code || '未知状态码'}):`, message || '无错误消息');
            error.message = message || '服务器错误';
        } else if (error.request) {
            // 请求已发送但没有收到响应
            console.error('网络错误：服务器无响应');
            error.message = '网络错误：服务器无响应';
        } else {
            // 请求配置错误
            console.error('请求错误：', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
