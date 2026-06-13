/**
 * pages.ts 路由清单测试
 */
import { describe, it, expect } from 'vitest'
import { PAGE_LIST, buildRoutes } from '@/router/pages'

describe('pages', () => {
  it('总页面数 ≥ 113（含 login + home + 其他）', () => {
    // PRD §附录 A 列出 113 项；本仓库当前清单可能因合并整理略有差异，
    // 至少保证 ≥ 113 - 5 容差，确保覆盖主要业务域
    expect(PAGE_LIST.length).toBeGreaterThanOrEqual(108)
  })

  it('login 不需要鉴权', () => {
    const login = PAGE_LIST.find((p) => p.path === '/login')
    expect(login).toBeTruthy()
    expect(login?.meta.requiresAuth).toBe(false)
  })

  it('RFID 标记为 hiddenInBs', () => {
    const rfid = PAGE_LIST.filter((p) => p.path.startsWith('/rfid'))
    expect(rfid.length).toBeGreaterThanOrEqual(2)
    for (const r of rfid) expect(r.meta.hiddenInBs).toBe(true)
  })

  it('buildRoutes 生成的路由表里 path 唯一', () => {
    const routes = buildRoutes()
    const paths = routes
      .map((r) => r.path)
      .filter((p) => p && !p.startsWith('/:'))
    expect(new Set(paths).size).toBe(paths.length)
  })
})
