import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      '/storybook': {
        target: 'http://localhost:6006',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storybook/, ''), // Remove /storybook when proxying
      },
    },
  },
})
