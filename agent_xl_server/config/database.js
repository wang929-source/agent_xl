/**
 * @description 数据库配置模块
 * 提供MySQL数据库连接池配置和连接测试功能
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL数据库配置
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || 3306),
  charset: process.env.DB_CHARSET || 'utf8mb4',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || 10)
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

/**
 * 测试数据库连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error.message);
    return false;
  }
}

export { pool, testConnection, dbConfig };