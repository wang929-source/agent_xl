/**
 * @description 智能体卡片管理路由模块
 * 提供智能体卡片的增删改查API接口
 */

import express from 'express';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { formatResponse, formatListResponse, formatErrorResponse, formatBadRequestResponse } from '../utils/responseFormatter.js';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取上传目录路径，优先使用环境变量中的配置，否则使用默认路径
const UPLOAD_DIR = process.env.UPLOAD_DIR 


// 获取配置信息
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

/**
 * @description 构建完整的LOGO URL
 * @param {string} logoName - LOGO文件名或完整URL
 * @returns {string|null} 完整的LOGO URL或null
 */
const buildLogoUrl = (logoName) => {
  if (!logoName) {
    return null;
  }
  
  // 检查是否已经是完整URL
  if (logoName.startsWith('http://') || logoName.startsWith('https://')) {
    return logoName;
  }
  
  // 提取logoName中的文件名部分（忽略任何路径信息）
  const cleanLogoName = path.basename(logoName);
  
  // 清理process.env.UPLOAD_DIR的原始值，移除前后多余斜杠和反斜杠
  const uploadDirPath = (process.env.UPLOAD_DIR )
    .replace(/^\/+|\/+$/g, '')
    .replace(/\\/g, '/');
  
  // 构建完整URL，确保各部分之间只有一个斜杠
  return `${BASE_URL.replace(/\/$/g, '')}/${uploadDirPath}/${cleanLogoName}`;
};

const router = express.Router();

/**
 * GET /api/cards/cards
 * 获取所有智能体卡片列表
 */
router.get('/cards', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM  agent_cards ORDER BY id DESC');
    
    // 处理每个卡片的logo URL
    const processedRows = rows.map(row => ({
      ...row,
      logo: buildLogoUrl(row.logo)
    }));
    
    res.json(formatListResponse(processedRows, processedRows.length));
  } catch (error) {
    console.error('获取卡片列表失败:', error);
    res.status(500).json(formatErrorResponse('获取卡片列表失败'));
  }
});

/**
 * GET /api/agentType/:type
 * 根据类型获取智能体卡片列表
 */
router.get('/agentType/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM agent_cards WHERE type = ? ORDER BY id DESC',
      [type]
    );
    
    // 处理每个卡片的logo URL
    const processedRows = rows.map(row => ({
      ...row,
      logo: buildLogoUrl(row.logo)
    }));
    
    res.json(formatListResponse(processedRows, processedRows.length));
  } catch (error) {
    console.error('根据类型获取卡片失败:', error);
    res.status(500).json(formatErrorResponse('根据类型获取卡片失败'));
  }
});

/**
 * POST /api/cards
 * 创建新的智能体卡片
 */
router.post('/', async (req, res) => {
  try {
    const { name, logo, description, type, corp, date, url, status } = req.body;
    
    // 参数验证
    if (!name) {
      return res.status(400).json(formatBadRequestResponse('缺少必要参数'));
    }
    
    // 生成唯一ID
    const id = uuidv4();
    
    // 插入新卡片到数据库
    const [result] = await pool.execute(
      'INSERT INTO agent_cards (id, name, logo, description, type, corp, date, url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, logo || null, description || null, type || null, corp || null, date || null, url || null, status || null]
    );
    
    // 返回新创建的卡片
    const [rows] = await pool.execute('SELECT * FROM agent_cards WHERE id = ?', [id]);
    const newCard = rows[0];
    newCard.logo = buildLogoUrl(newCard.logo);
    res.status(201).json(formatResponse(newCard, '创建成功', 201));
  } catch (error) {
    console.error('创建卡片失败:', error);
    res.status(500).json(formatErrorResponse('创建卡片失败'));
  }
});

/**
 * PUT /api/cards/:id
 * 编辑指定的智能体卡片（不包括ID）
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, url, type, logo } = req.body;
    
    // 参数验证
    if (!name) {
      return res.status(400).json(formatBadRequestResponse('缺少必要参数'));
    }
    
    // 检查卡片是否存在
    const [existingCards] = await pool.execute(
      'SELECT * FROM  agent_cards WHERE id = ?',
      [id]
    );
    
    if (existingCards.length === 0) {
      return res.status(404).json(formatErrorResponse('卡片不存在', 404));
    }
    
    // 更新卡片信息
    await pool.execute(
      'UPDATE  agent_cards SET name = ?, description = ?, url = ?, type = ?, logo = ? WHERE id = ?',
      [name, description, url, type, logo || null, id]
    );
    
    // 返回更新后的卡片
    const [updatedCards] = await pool.execute(
      'SELECT * FROM  agent_cards WHERE id = ?',
      [id]
    );
    const updatedCard = updatedCards[0];
    updatedCard.logo = buildLogoUrl(updatedCard.logo);
    
    res.json(formatResponse(updatedCard, '更新成功'));
  } catch (error) {
    console.error('更新卡片失败:', error);
    res.status(500).json(formatErrorResponse('更新卡片失败'));
  }
});

/**
 * PUT /api/cards/:id/url
 * 更新卡片URL
 */
router.put('/:id/url', async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;
    
    // 检查卡片是否存在
    const [existingCards] = await pool.execute(
      'SELECT * FROM  agent_cards WHERE id = ?',
      [id]
    );
    
    if (existingCards.length === 0) {
      return res.status(404).json(formatErrorResponse('卡片不存在', 404));
    }
    
    // 更新卡片URL（允许为空）
    await pool.execute(
      'UPDATE  agent_cards SET url = ? WHERE id = ?',
      [url || null, id]
    );
    
    // 返回更新后的卡片
    const [updatedCards] = await pool.execute(
      'SELECT * FROM  agent_cards WHERE id = ?',
      [id]
    );
    const updatedCard = updatedCards[0];
    updatedCard.logo = buildLogoUrl(updatedCard.logo);
    
    res.json(formatResponse(updatedCard, 'URL更新成功'));
  } catch (error) {
    console.error('更新卡片URL失败:', error);
    res.status(500).json(formatErrorResponse('更新卡片URL失败'));
  }
});

/**
 * DELETE /api/cards/:id
 * 删除指定的智能体卡片
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查卡片是否存在
    const [existingCards] = await pool.execute(
      'SELECT * FROM agent_cards WHERE id = ?',
      [id]
    );
    
    if (existingCards.length === 0) {
      return res.status(404).json(formatErrorResponse('卡片不存在', 404));
    }
    
    const card = existingCards[0];
    
    // 从数据库中删除卡片
    await pool.execute(
      'DELETE FROM agent_cards WHERE id = ?',
      [id]
    );
    
    // 如果有logo文件，则也删除它
    if (card.logo) {
      try {
        const logoPath = path.join(UPLOAD_DIR, card.logo);
        await fs.unlink(logoPath);
      } catch (unlinkError) {
        // 如果删除文件失败，仅记录日志但不影响删除操作
        console.warn('删除Logo文件失败:', unlinkError.message);
      }
    }
    
    // RESTful 标准：删除成功返回 204 状态码，无响应体
    res.status(204).send();
  } catch (error) {
    console.error('删除卡片失败:', error);
    res.status(500).json(formatErrorResponse('删除卡片失败'));
  }
});

export default router;