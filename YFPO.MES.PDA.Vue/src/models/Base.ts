/**
 * 后端调用契约 —— 与旧 Ionic 项目 `src/models/BaseInformation_I.ts`、
 * `BaseInfomation_O.ts`、`ClientInformation.ts` 字段名/大小写完全一致。
 *
 * 注意：保留原始拼写（如 `BaseInfomation_O` 缺一个字母 'r'、`result` 小写、
 * `Parameters` 大写、`ErrorExcepiton` 拼写错误），以保证抓包对比时与旧版字字一致。
 */

/** 单个参数项 —— 对应旧 Parameters.ts */
export interface Parameters {
  Name: string
  Value: any
  TypeName: string
}

/** MES 异常 —— 对应旧 MESException */
export interface MESException {
  Message?: string
  StackTrace?: string
  [key: string]: any
}

/**
 * 客户端信息 —— 对应旧 ClientInformation
 * v1.1：Machine 字段固定为 "Web-{uuid}"，由前端 plugins/device.ts 生成
 */
export interface ClientInformation {
  LogID: string
  Machine: string
  CurrentSysUser: string
  System: string
  IP: string
  TransferMethod: number
  clientTraceInfo: string
  LoginUser?: string
  CompanyCode?: string
  FactoryCode?: string
}

/** 请求体 —— 对应旧 BaseInformation_I */
export interface BaseInformation_I {
  ClientInfo?: ClientInformation
  PersistenceCode: string
  ClassName: string
  FunctionName: string
  Parameters: Parameters[]
}

/** 响应体 —— 注意保留旧版拼写 BaseInfomation_O */
export interface BaseInfomation_O<T = any> {
  result: T
  Parameters: Parameters[]
  Error: string
  ErrorExcepiton: MESException
  ErrorCode: number
}

/** TransferType 枚举 —— 旧版常量 */
export const TransferType = {
  Json: 0,
  Xml: 1,
} as const

/** 工厂条目 —— v1.1：仅保留代码与显示名，不再含 WSDL URL */
export interface FactoryItem {
  code: string
  name: string
}
