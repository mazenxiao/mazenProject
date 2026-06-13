/**
 * 设备/会话 ID
 *
 * v1.1：旧 ScannerPlugin.GetDeviceSerialNumber 在 BS 模式失能。
 * 改为前端首次启动时生成 UUID，写入 localStorage 永久持有，
 * 上报 ClientInfo.Machine = "Web-{uuid}"
 */

import { v4 as uuidv4 } from 'uuid'

const KEY = 'mes-pda.machineId'

export function getMachineId(): string {
  let id = localStorage.getItem(KEY)
  if (!id) {
    const uuid =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : uuidv4()
    id = 'Web-' + uuid
    localStorage.setItem(KEY, id)
  }
  return id
}

/** 测试用：清空持久化 ID，下次调用会重新生成 */
export function resetMachineId(): void {
  localStorage.removeItem(KEY)
}
