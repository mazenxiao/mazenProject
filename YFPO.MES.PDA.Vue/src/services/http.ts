/**
 * axios 实例 + 请求/响应拦截器
 *
 * 所有后端调用都会经过这里：
 *   POST {VITE_API_BASE}/Home/Send  （v1.1 单一通道）
 *
 * 拦截器职责：
 *   - 请求：附加 X-MES-Client-Version 头
 *   - 响应：5xx 重试 1 次（间隔 500ms）；401 跳登录页
 *   - 错误：统一转 Error 抛出，让上层 try/catch 拿到 message
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

const APP_VERSION =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

interface RetryableConfig extends InternalAxiosRequestConfig {
  __retryCount?: number
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json, text/plain, */*',
  },
  // WCF 中转返回的是 text/plain（body 是 JSON 字符串），
  // 让 axios 不要直接 JSON.parse，由 adapter 的 parseBaseResult 决定
  responseType: 'text',
  transformResponse: [(data) => data],
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('X-MES-Client-Version', APP_VERSION)
  return config
})

const MAX_RETRY = 1
const RETRY_DELAY = 500

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const cfg = (error.config || {}) as RetryableConfig
    const status = error.response?.status

    // 401 → 跳登录
    if (status === 401) {
      // 由 router 的全局守卫兜底；这里不强行跳，避免循环
      return Promise.reject(new Error('Unauthorized'))
    }

    // 5xx 或网络错误 → 重试
    const shouldRetry =
      (!error.response || (status && status >= 500)) &&
      (cfg.__retryCount ?? 0) < MAX_RETRY

    if (shouldRetry) {
      cfg.__retryCount = (cfg.__retryCount ?? 0) + 1
      await new Promise((r) => setTimeout(r, RETRY_DELAY))
      return http.request(cfg as AxiosRequestConfig)
    }

    return Promise.reject(error)
  },
)

export default http
