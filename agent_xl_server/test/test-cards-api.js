import fetch from 'node-fetch';

async function testCardsAPI() {
  const baseURL = 'http://localhost:3001/api/cards';
  
  try {
    // 测试获取所有卡片
    console.log('--- 测试获取所有卡片 ---');
    let response = await fetch(baseURL);
    let result = await response.json();
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify({ code: result.code, message: result.message, dataLength: Array.isArray(result.data) ? result.data.length : 'N/A', total: result.total }, null, 2));
    
    // 测试创建新卡片
    console.log('\n--- 测试创建新卡片 ---');
    response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '测试卡片',
        description: '这是一个测试卡片',
        type: 'test'
      })
    });
    
    result = await response.json();
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2));
    
    // 保存创建的卡片ID用于后续测试
    const cardId = result.data.id;
    
    // 测试更新卡片
    console.log('\n--- 测试更新卡片 ---');
    response = await fetch(`${baseURL}/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '更新后的测试卡片',
        description: '这是更新后的测试卡片',
        type: 'test-updated'
      })
    });
    
    result = await response.json();
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2));
    
    // 测试更新卡片URL
    console.log('\n--- 测试更新卡片URL ---');
    response = await fetch(`${baseURL}/${cardId}/url`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://example.com'
      })
    });
    
    result = await response.json();
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2));
    
    // 测试根据类型获取卡片
    console.log('\n--- 测试根据类型获取卡片 ---');
    response = await fetch(`${baseURL}/type/test-updated`);
    result = await response.json();
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify({ code: result.code, message: result.message, dataLength: Array.isArray(result.data) ? result.data.length : 'N/A', total: result.total }, null, 2));
    
    // 测试删除卡片
    console.log('\n--- 测试删除卡片 ---');
    response = await fetch(`${baseURL}/${cardId}`, {
      method: 'DELETE'
    });
    
    console.log('状态码:', response.status);
    if (response.status !== 204) {
      result = await response.json();
      console.log('响应:', JSON.stringify({ code: result.code, message: result.message }, null, 2));
    } else {
      console.log('卡片删除成功');
    }
    
    console.log('\n--- 所有测试完成 ---');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testCardsAPI();