import fs from 'fs';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import fetch from 'node-fetch';

// 使用 fetch 发送文件上传请求
async function testUpload() {
  try {
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('logo', createReadStream('./test/test-logo.png'));
    
    // 发送请求
    const response = await fetch('http://localhost:3001/api/upload-logo', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('上传结果:', result);
  } catch (error) {
    console.error('上传失败:', error);
  }
}

testUpload();