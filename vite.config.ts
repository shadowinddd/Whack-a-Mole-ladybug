import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键配置：设置为相对路径，这样无论部署在 /ladybug/ 还是根目录都能正常加载资源
  base: './', 
})