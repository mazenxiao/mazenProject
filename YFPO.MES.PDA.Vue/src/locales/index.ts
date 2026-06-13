/**
 * vue-i18n 集成
 */
import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import en from './en.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('mes-pda.lang') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: { 'zh-CN': zhCN, en },
})

export default i18n
