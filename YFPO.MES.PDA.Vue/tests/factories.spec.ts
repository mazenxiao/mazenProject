/**
 * factories.ts 单元测试
 */
import { describe, it, expect } from 'vitest'
import { FACTORIES, getFactoryByCode } from '@/services/factories'

describe('factories', () => {
  it('FACTORIES 长度 = 19（与旧 apis.ts 一致）', () => {
    expect(FACTORIES.length).toBe(19)
  })

  it('每个 factory 都有 code + name', () => {
    for (const f of FACTORIES) {
      expect(f.code).toBeTruthy()
      expect(f.name).toBeTruthy()
    }
  })

  it('code 不重复', () => {
    const codes = FACTORIES.map((f) => f.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('getFactoryByCode 命中', () => {
    expect(getFactoryByCode('AT')?.name).toBe('安亭')
    expect(getFactoryByCode('NotExist')).toBeUndefined()
    expect(getFactoryByCode('')).toBeUndefined()
  })
})
