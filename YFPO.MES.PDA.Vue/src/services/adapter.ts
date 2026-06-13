/**
 * 后端调用适配层 —— 行为对齐旧 Ionic `app-service.ts:send()`
 *
 * v1.1 调整：
 *   - 删除 SOAP 直连分支（window["SendHelper"]）
 *   - 仅保留 HTTP 中转：POST {VITE_API_BASE}/Home/Send
 *   - Machine 字段从 "PDA-{serial}" 改为 "Web-{uuid}"
 *
 * `parseBaseResult` 解析行为字字对应旧 send 中的分支：
 *   1. result === ''           → 视为成功，返回 undefined
 *   2. !result && Error        → 截 \r 之前 + 去 'System.Exception:' 前缀，抛 Error
 *   3. 字符串 + 含 {[          → JSON.parse 后再判断 result 嵌套
 *   4. 字符串 + 'true'/'false' → 透传
 *   5. 其他字符串              → 透传
 */

import http from './http'
import { TransferType } from '@/models/Base'
import type { BaseInformation_I, BaseInfomation_O, ClientInformation } from '@/models/Base'
import { useUserStore } from '@/store/user'
import { useCompanyStore } from '@/store/company'
import { getMachineId } from '@/plugins/device'

const SEND_PATH = '/Home/Send'

/**
 * 发起一次 MES 请求 —— OP 服务的所有方法最终都走这里
 *
 * @param i  请求体（不含 ClientInfo，由本函数自动注入）
 */
export async function mesSend<T = any>(i: BaseInformation_I): Promise<T> {
  const userStore = useUserStore()
  const companyStore = useCompanyStore()

  const ClientInfo: ClientInformation = {
    LogID: 'LogID',
    Machine: getMachineId(),
    CurrentSysUser: 'CurrentSysUser',
    System: 'System',
    IP: 'IP',
    TransferMethod: TransferType.Json,
    clientTraceInfo: 'clientTraceInfo',
    LoginUser: userStore.user?.UserAccount,
    CompanyCode: companyStore.company?.CompanyCode,
    FactoryCode: companyStore.factory?.FactoryCode,
  }

  const body: BaseInformation_I = {
    ClientInfo,
    PersistenceCode: i.PersistenceCode,
    ClassName: i.ClassName,
    FunctionName: i.FunctionName,
    Parameters: i.Parameters,
  }

  const resp = await http.post<string>(SEND_PATH, body)
  return parseBaseResult<T>(resp.data) as T
}

/**
 * 解析后端返回 —— 与旧 send() 解析逻辑字字对应
 *
 * 后端返回是 text/plain，body 为 BaseInfomation_O<string> 的 JSON 字符串。
 */
export function parseBaseResult<T = any>(raw: string | BaseInfomation_O<T>): T | undefined {
  if (raw === undefined || raw === null || raw === '') {
    return undefined
  }

  // raw 可能是已被 axios 解析过的对象，也可能仍是字符串
  let outer: BaseInfomation_O<any>
  if (typeof raw === 'string') {
    try {
      outer = JSON.parse(raw)
    } catch {
      // 如果连最外层 JSON 都解析不了，按字符串透传
      return raw as unknown as T
    }
  } else {
    outer = raw
  }

  const { result, Error: errMsg } = outer

  // 分支：result 为空但有错误
  if ((result === undefined || result === null || result === '') && errMsg) {
    throw new Error(formatBackendError(errMsg))
  }

  // 分支：result 为空 → 视为成功
  if (result === undefined || result === null || result === '') {
    return undefined
  }

  // 分支：result 是字符串
  if (typeof result === 'string') {
    const trimmed = result.trim()

    // 布尔字面量直接转
    if (trimmed === 'true') return true as unknown as T
    if (trimmed === 'false') return false as unknown as T

    // 含 { 或 [ → 二次 parse
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed) as T
      } catch {
        return trimmed as unknown as T
      }
    }

    return trimmed as unknown as T
  }

  // result 是其他类型（数字、布尔、对象、数组）→ 直接透传
  return result as T
}

/**
 * 后端错误信息扁平化
 * 旧 send() 中：截取 \r 之前；如果以 "System.Exception:" 开头则去掉前缀
 */
function formatBackendError(err: string): string {
  let msg = err
  const idx = msg.indexOf('\r')
  if (idx > -1) msg = msg.substring(0, idx)
  const prefix = 'System.Exception:'
  if (msg.startsWith(prefix)) msg = msg.substring(prefix.length).trim()
  return msg
}
