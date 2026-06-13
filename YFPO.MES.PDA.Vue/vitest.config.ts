/**
 * Vitest 配置
 */
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/views/_placeholder/**'],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('test'),
  },
})
