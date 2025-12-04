import fetch from 'node-fetch';

async function testAPIResponses() {
  const baseURL = 'http://localhost:3001/api';
  
  try {
    console.log('=== 测试API响应格式 ===\n');
    
    // 测试健康检查端点
    console.log('1. 测试健康检查端点:');
    let response = await fetch(`${baseURL}/health`);
    let result = await response.json();
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message }, null, 2)}\n`);
    
    // 测试获取所有卡片
    console.log('2. 测试获取所有卡片:');
    response = await fetch(`${baseURL}/cards`);
    result = await response.json();
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, dataLength: Array.isArray(result.data) ? result.data.length : 'N/A', total: result.total }, null, 2)}\n`);
    
    // 测试创建新卡片
    console.log('3. 测试创建新卡片:');
    response = await fetch(`${baseURL}/cards`, {
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
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2)}`);
    
    // 保存创建的卡片ID用于后续测试
    const cardId = result.data.id;
    console.log(`   创建的卡片ID: ${cardId}\n`);
    
    // 测试更新卡片
    console.log('4. 测试更新卡片:');
    response = await fetch(`${baseURL}/cards/${cardId}`, {
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
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2)}\n`);
    
    // 测试更新卡片URL
    console.log('5. 测试更新卡片URL:');
    response = await fetch(`${baseURL}/cards/${cardId}/url`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://example.com'
      })
    });
    
    result = await response.json();
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2)}\n`);
    
    // 测试根据类型获取卡片
    console.log('6. 测试根据类型获取卡片:');
    response = await fetch(`${baseURL}/cards/type/test-updated`);
    result = await response.json();
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, dataLength: Array.isArray(result.data) ? result.data.length : 'N/A', total: result.total }, null, 2)}\n`);
    
    // 测试删除卡片
    console.log('7. 测试删除卡片:');
    response = await fetch(`${baseURL}/cards/${cardId}`, {
      method: 'DELETE'
    });
    
    console.log(`   状态码: ${response.status}`);
    if (response.status !== 204) {
      result = await response.json();
      console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message }, null, 2)}`);
    } else {
      console.log('   响应格式: 204 No Content (符合RESTful标准)');
    }
    
    // 测试上传Logo端点 (简单测试)
    console.log('\n8. 测试根路径API文档:');
    response = await fetch(`${baseURL}/`);
    result = await response.json();
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应格式: ${JSON.stringify({ code: result.code, message: result.message, hasData: !!result.data }, null, 2)}\n`);
    
    console.log('=== 所有API响应格式测试完成 ===');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testAPIResponses();