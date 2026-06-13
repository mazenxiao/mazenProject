/**
 * 通用领域模型样例
 *
 * 完整 208 个 model 由 `scripts/codegen-models.ts` 从旧 Ionic
 * `src/models/*.ts` 批量迁移生成；本文件仅放最常用的几个，
 * 给迭代 1 / 2 的登录、首页、用户态先用。
 */

/** 用户 —— 对应旧 User */
export interface User {
  UserAccount?: string
  UserName?: string
  UserPassword?: string
  CompanyCode?: string
  FactoryCode?: string
  Language?: string
  [key: string]: any
}

/** 公司 —— 对应旧 Company */
export interface Company {
  CompanyCode?: string
  CompanyName?: string
  [key: string]: any
}

/** 工厂 —— 对应旧 Factory */
export interface Factory {
  FactoryCode?: string
  FactoryName?: string
  CompanyCode?: string
  [key: string]: any
}

/** 程序/菜单条目 —— 对应旧 Program */
export interface Program {
  ProgramID?: string
  ProgramName?: string
  ProgramCode?: string
  ParentID?: string
  Icon?: string
  Url?: string
  Sort?: number
  Privileges?: string[]
  [key: string]: any
}

/** 站点扫描信息 —— 对应旧 ScanSiteInfo */
export interface ScanSiteInfo {
  SiteCode?: string
  SiteName?: string
  [key: string]: any
}
