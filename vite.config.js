import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// })

export default defineConfig({
  plugins: [vue(),
  basicSsl()],
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // 设置路径
      '~': path.resolve(__dirname, './'),
      // 设置别名
      '@': path.resolve(__dirname, './src')
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    https: true,
    proxy: {


      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'https://172.22.225.34:9888',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/ws': {
      //   target: 'wss://172.22.225.34:9888/ws',
      //   ws: true,
      // },

    },
  },
})
