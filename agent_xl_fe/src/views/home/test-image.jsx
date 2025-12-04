import React from 'react';

// 测试不同的图片路径格式
const TestImage = () => {
  const testPaths = [
    '/src/assets/knldge_icon3.png',
    'src/assets/knldge_icon3.png',
    '../../assets/knldge_icon3.png',
    '/assets/knldge_icon3.png',
    'assets/knldge_icon3.png'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>图片路径测试</h2>
      {testPaths.map((path, index) => (
        <div key={index} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
          <p>路径: {path}</p>
          <img 
            src={path} 
            alt={`测试${index}`} 
            style={{ width: '50px', height: '50px', border: '2px solid red' }}
            onError={(e) => {
              console.error(`图片加载失败: ${path}`, e);
              e.target.style.border = '2px solid red';
            }}
            onLoad={(e) => {
              console.log(`图片加载成功: ${path}`);
              e.target.style.border = '2px solid green';
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TestImage;