import fetch from 'node-fetch';

async function testCreateCard() {
  try {
    const response = await fetch('http://localhost:3001/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": "测试卡片",
        "logo": "logo-1764590526266-79610927.png",
        "description": "测试描述",
        "type": "test",
        "corp": "测试公司",
        "url": "http://test.com",
        "date": "2025-12-01"
      })
    });
    
    const result = await response.json();
    console.log('创建卡片结果:', result);
  } catch (error) {
    console.error('创建卡片失败:', error);
  }
}

testCreateCard();