/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_DEFAULT_LANG: string
  readonly VITE_VERSION_FILE: string
  readonly VITE_VERSION_POLL_INTERVAL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const c: DefineComponent<object, object, any>
  export default c
}
