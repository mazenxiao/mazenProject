/**
 * 应用入口
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './locales'

// 全局样式
import './styles/global.scss'

// Vant
import 'vant/lib/index.css'
// Element Plus（按需 + 基础样式）
import 'element-plus/dist/index.css'
// VXE-Table
import 'vxe-table/lib/style.css'
// @ts-ignore: vxe-table 默认导出
import VxeUI from 'vxe-pc-ui'
import VxeTable from 'vxe-table'
import 'vxe-pc-ui/lib/style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VxeUI)
app.use(VxeTable)

app.config.errorHandler = (err, _vm, info) => {
  console.error('[GlobalError]', info, err)
}

app.mount('#app')
