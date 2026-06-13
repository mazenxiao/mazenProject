import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'
import fs from 'node:fs'
// @ts-ignore: 第三方插件无类型声明
import pxToViewport from 'postcss-px-to-viewport-8-plugin'

/**
 * Vite 构建配置
 *
 * 设计要点：
 *   1. base 与 WebAppRoute 同站子路径对齐：'/mes-pda/'
 *   2. PDA 默认 WebView 是 Chromium 80+，使用 legacy 插件兜底；语法目标 ES2018
 *   3. UI 组件按需自动导入（Vant 移动端 + Element Plus 大屏）
 *   4. postcss-px-to-viewport：以 375 为基准做 vw 转换；带 [no-vw] 注释的样式跳过
 *   5. 代理 /api/mes 到中转 WebApi（旧版 PC 调试地址 10.250.16.85）
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://10.250.16.85'

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'),
  )

  return {
    base: '/mes-pda/',
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          pxToViewport({
            unitToConvert: 'px',
            viewportWidth: 375,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: ['.no-vw', '.el-'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules\/(element-plus|vxe-table)/i],
          }),
        ],
      },
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        resolvers: [VantResolver(), ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: { enabled: false },
      }),
      Components({
        resolvers: [VantResolver(), ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      legacy({
        targets: ['Chrome >= 80', 'Edge >= 80'],
        modernPolyfills: true,
        renderLegacyChunks: false,
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/mes': {
          target: apiTarget,
          changeOrigin: true,
          // WebAppRoute/Home/Send 是旧的中转地址；本地开发时把 /api/mes/Home/Send 转发过去
          rewrite: (p) => p.replace(/^\/api\/mes/, '/WebAppRoute'),
        },
      },
    },
    build: {
      target: ['chrome80', 'edge80'],
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
            'vendor-ui': ['vant', 'element-plus', 'vxe-table'],
            'vendor-utils': ['axios', 'uuid', '@vueuse/core'],
          },
        },
      },
    },
  }
})
