/**
 * 版本检查 + 强刷提示 —— 替代旧 hcphelper / chcp
 *
 * 工作机制：
 *   1. 启动时拉取 /version.json，记下 currentVersion
 *   2. 每隔 VITE_VERSION_POLL_INTERVAL（默认 60s）再拉一次，对比版本号
 *   3. 不一致 → showConfirmDialog → location.reload()
 *
 * 部署侧：CI 在 dist/version.json 写入 { version, buildTime, commit }
 */

import { showConfirmDialog, showToast } from 'vant'
import { useVersionStore } from '@/store/version'

const VERSION_FILE =
  import.meta.env.VITE_VERSION_FILE || '/mes-pda/version.json'
const POLL_INTERVAL = Number(
  import.meta.env.VITE_VERSION_POLL_INTERVAL || 60_000,
)

let timer: ReturnType<typeof setInterval> | null = null

interface VersionFile {
  version: string
  buildTime?: string
  commit?: string
}

async function fetchVersion(): Promise<VersionFile | null> {
  try {
    const r = await fetch(`${VERSION_FILE}?_t=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!r.ok) return null
    return (await r.json()) as VersionFile
  } catch {
    return null
  }
}

export async function startVersionWatch(): Promise<void> {
  const v = useVersionStore()
  const init = await fetchVersion()
  if (init) {
    v.current = init.version
    v.latest = init.version
    v.buildTime = init.buildTime
  }
  if (timer) clearInterval(timer)
  timer = setInterval(checkVersion, POLL_INTERVAL)
}

export function stopVersionWatch(): void {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

let promptOpen = false

async function checkVersion(): Promise<void> {
  if (promptOpen) return
  const v = useVersionStore()
  const latest = await fetchVersion()
  if (!latest) return
  if (latest.version === v.current) return

  v.latest = latest.version
  v.hasNew = true
  promptOpen = true
  try {
    await showConfirmDialog({
      title: '版本更新',
      message: `检测到新版本，是否立即刷新？\n当前 ${v.current}\n最新 ${latest.version}`,
      confirmButtonText: '立即刷新',
      cancelButtonText: '稍后',
    })
    showToast({ message: '正在刷新…', duration: 800 })
    setTimeout(() => location.reload(), 500)
  } catch {
    // 用户点了"稍后"，1 个轮询周期后再问
  } finally {
    promptOpen = false
  }
}
