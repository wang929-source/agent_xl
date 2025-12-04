/**
 * @description 智能体卡片相关API接口
 * 提供与后端服务通信的方法
 */

import axiosInstance from '../util/axios';
import { UPLOAD_DIR } from '../util/constant';

/**
 * 获取所有智能体卡片数据
 * @returns {Promise<Object>} 返回卡片数据
 */
export const getAllAgentCards = async () => {
  try {
    return await axiosInstance.get('/cards');
  } catch (error) {
    console.error('获取智能体卡片数据失败:', error);
    throw error;
  }
};

/**
 * 根据类型获取智能体卡片数据
 * @param {string} type - 卡片类型
 * @returns {Promise<Object>} 返回指定类型的卡片数据
 */
export const getAgentCardsByType = async (type) => {
  try {
    return await axiosInstance.get(`/agentType/${type}`);
  } catch (error) {
    console.error(`获取类型 ${type} 的智能体卡片数据失败:`, error);
    throw error;
  }
};

/**
 * 更新智能体卡片的URL
 * @param {string} cardId - 卡片ID
 * @param {string|null} url - URL地址（可以为空）
 * @returns {Promise<Object>} 返回更新结果
 */
export const updateAgentCardUrl = async (cardId, url) => {
  try {
    return await axiosInstance.put(`/cards/${cardId}/url`, { url });
  } catch (error) {
    console.error(`更新卡片 ${cardId} URL失败:`, error);
    throw error;
  }
};

/**
 * 上传Logo文件
 * @param {File} file - 要上传的文件
 * @returns {Promise<Object>} 返回上传结果
 */
export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    
    return await axiosInstance.post('/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        uploadDir: UPLOAD_DIR // 传递上传目录参数给后端
      }
    });
  } catch (error) {
    console.error('Logo上传失败:', error);
    throw error;
  }
};

/**
 * 健康检查
 * @returns {Promise<Object>} 返回服务状态
 */
export const checkHealth = async () => {
  try {
    return await axiosInstance.get('/health');
  } catch (error) {
    console.error('健康检查失败:', error);
    throw error;
  }
};

/**
 * 创建新的智能体卡片
 * @param {Object} cardData - 卡片数据
 * @param {string} cardData.name - 卡片名称（必填，不超过20字符）
 * @param {string} cardData.logo - Logo路径
 * @param {string} cardData.description - 描述
 * @param {string} cardData.type - 分类
 * @param {string} cardData.corp - 状态（未发布/已发布）
 * @param {string} cardData.url - URL地址
 * @param {string} cardData.date - 使用模型
 * @returns {Promise<Object>} 返回创建结果
 */
export const createAgentCard = async (cardData) => {
  try {
    // 验证输入数据的有效性
    if (!cardData || typeof cardData !== 'object') {
      throw new Error('卡片数据必须是对象类型');
    }

    // 验证必填字段
    if (!cardData.name || !cardData.name.toString().trim()) {
      throw new Error('智能体名称不能为空');
    }
    if (!cardData.description || !cardData.description.toString().trim()) {
      throw new Error('智能体描述不能为空');
    }
    // 验证description长度不超过100字符
    if (cardData.description.toString().trim().length > 100) {
      throw new Error('智能体描述长度不能超过100个字符');
    }

    // 确保所有字段都是字符串类型，按照后端SQL语句列名顺序：name, logo, description, type, corp, date, url, status
    const processedData = {
      name: cardData.name.toString().trim(),
      logo: cardData.logo || '',
      description: cardData.description.toString().trim(),
      type: cardData.type || '通用',
      corp: cardData.corp || '未发布',
      date: cardData.date || '',
      url: cardData.url || '',
      status: cardData.status || '正常'
    };
    
    // 添加调试日志，查看发送的数据
    console.log('创建智能体卡片请求数据:', processedData);
   
    const response = await axiosInstance.post('/cards', processedData);
    console.log('创建智能体卡片响应数据:', response);
    return response;
  } catch (error) {
    console.error('创建智能体卡片失败:', error);
    throw error;
  }
};

/**
 * 根据ID删除智能体卡片
 * @param {string} cardId - 卡片ID
 * @returns {Promise<Object>} 返回删除结果
 */
export const deleteAgentCard = async (cardId) => {
  try {
    const response = await axiosInstance.delete(`/cards/${cardId}`);
    console.log(`删除卡片 ${cardId} 成功，后端返回:`, response);
    return response;
  } catch (error) {
    // 添加更多调试信息
    console.error(`删除卡片 ${cardId} 失败:`, {
      error: error,
      errorMessage: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};