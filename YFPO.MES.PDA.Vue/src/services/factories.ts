/**
 * 工厂代码列表 —— v1.1：仅保留工厂代码与显示名，不再含 WSDL URL
 *
 * 数据来源：旧 Ionic `src/providers/apis/apis.ts` WSDL_LIST 中的 19 个工厂
 * （安亭、常熟、慈溪、东莞、哈尔滨、江夏、南京、浦东、铁西、武汉、
 *   萧山、烟台、仪征、长沙、宁德、重庆、杭州、长春、延康）
 *
 * ⚠️ `code` 字段需要与后端 WebAppRoute 路由表对齐。下表的 code 是按
 * 03-开发PRD §3.2 暂定值，**正式上线前必须由 IT/后端确认并修订**。
 */

import type { FactoryItem } from '@/models/Base'

export const FACTORIES: ReadonlyArray<FactoryItem> = [
  { code: 'AT', name: '安亭' },
  { code: 'CS', name: '常熟' },
  { code: 'CX', name: '慈溪' },
  { code: 'DG', name: '东莞' },
  { code: 'HRB', name: '哈尔滨' },
  { code: 'JX', name: '江夏' },
  { code: 'NJ', name: '南京' },
  { code: 'PD', name: '浦东' },
  { code: 'TX', name: '铁西' },
  { code: 'WH', name: '武汉' },
  { code: 'XS', name: '萧山' },
  { code: 'YT', name: '烟台' },
  { code: 'YZ', name: '仪征' },
  { code: 'CSh', name: '长沙' },
  { code: 'ND', name: '宁德' },
  { code: 'CQ', name: '重庆' },
  { code: 'HZ', name: '杭州' },
  { code: 'CC', name: '长春' },
  { code: 'YK', name: '延康' },
] as const

export const LAST_FACTORY_KEY = 'mes-pda.lastFactoryCode'

export function getFactoryByCode(code: string | undefined | null): FactoryItem | undefined {
  if (!code) return undefined
  return FACTORIES.find((f) => f.code === code)
}
