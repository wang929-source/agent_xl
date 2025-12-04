import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  const API_BASE_URL = env.VITE_API_BASE_URL ;
  
  // 调试日志
  console.log('VITE_API_BASE_URL from env:', env.VITE_API_BASE_URL);
  console.log('Using API_BASE_URL:', API_BASE_URL);
  
  return {
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        // 添加超时配置
        timeout: 5000,
        // 错误处理
        onError: (err, req, res) => {
          console.log('Proxy error:', err.message);
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end('Proxy error: ' + err.message);
        }
      },
      // 代理图片资源以解决CORS问题
      '/data': {
        target: API_BASE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        timeout: 10000,
        onError: (err, req, res) => {
          console.log('Image proxy error:', err.message);
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end('Image proxy error: ' + err.message);
        }
      }
    }
  },
    define: {
      'import.meta.env.VITE_UPLOAD_DIR': JSON.stringify(env.VITE_UPLOAD_DIR),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL)
    }
  }
})
