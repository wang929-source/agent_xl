// 测试URL构建逻辑
import { API_BASE_URL, UPLOAD_DIR } from './src/util/constant';

// 模拟数据库中只有文件名的情况
const testLogoPaths = ['huagege.png', 'logo-123.png', '/existing/path/logo.png'];

console.log('Testing URL construction logic...');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('UPLOAD_DIR:', UPLOAD_DIR);
console.log('--------------------------------');

testLogoPaths.forEach(logoPath => {
  // 模拟前端构建URL的逻辑
  let imageUrl;
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    imageUrl = logoPath;
  } else {
    const baseUrlWithSlash = API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/';
    const cleanUploadDir = UPLOAD_DIR.replace(/^\/+|\/+$/g, '');
    const cleanLogoPath = logoPath.replace(/^\//, '');
    imageUrl = `${baseUrlWithSlash}${cleanUploadDir}/${cleanLogoPath}`;
  }
  
  // 模拟渲染部分的路径构建
  let renderPath;
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    renderPath = logoPath;
  } else {
    const cleanUploadDir = UPLOAD_DIR.replace(/^\/|\/$/g, '');
    const cleanLogo = logoPath.replace(/^\//, '');
    renderPath = `/${cleanUploadDir}/${cleanLogo}`;
  }
  
  console.log(`Original logoPath: "${logoPath}"`);
  console.log(`Constructed imageUrl: ${imageUrl}`);
  console.log(`Render path: ${renderPath}`);
  console.log('--------------------------------');
});
