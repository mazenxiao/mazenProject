/**
 * adapter.ts 单元测试
 * 验证 parseBaseResult 行为与旧 send() 解析逻辑字字一致
 */
import { describe, it, expect } from 'vitest'
import { parseBaseResult } from '@/services/adapter'

describe('parseBaseResult', () => {
  it('空字符串 → undefined（视为成功）', () => {
    expect(parseBaseResult('')).toBeUndefined()
  })

  it('null / undefined → undefined', () => {
    expect(parseBaseResult(null as any)).toBeUndefined()
    expect(parseBaseResult(undefined as any)).toBeUndefined()
  })

  it('result 为空 + Error 非空 → 抛 Error，并截 \\r 之前', () => {
    const raw = JSON.stringify({
      result: '',
      Error: 'boom\r\nstacktrace…',
      Parameters: [],
      ErrorExcepiton: {},
      ErrorCode: 1,
    })
    expect(() => parseBaseResult(raw)).toThrow(/boom/)
    expect(() => parseBaseResult(raw)).not.toThrow(/stacktrace/)
  })

  it('Error 以 System.Exception: 开头 → 去前缀', () => {
    const raw = JSON.stringify({
      result: '',
      Error: 'System.Exception:用户不存在',
      Parameters: [],
      ErrorExcepiton: {},
      ErrorCode: 1,
    })
    try {
      parseBaseResult(raw)
    } catch (e: any) {
      expect(e.message).toBe('用户不存在')
    }
  })

  it("result === 'true' / 'false' → 布尔", () => {
    const okRaw = JSON.stringify({ result: 'true', Error: '' })
    const noRaw = JSON.stringify({ result: 'false', Error: '' })
    expect(parseBaseResult(okRaw)).toBe(true)
    expect(parseBaseResult(noRaw)).toBe(false)
  })

  it("result 是嵌套 JSON 字符串 → 二次 parse", () => {
    const inner = { UserAccount: 'zhangsan', UserName: '张三' }
    const raw = JSON.stringify({ result: JSON.stringify(inner), Error: '' })
    expect(parseBaseResult(raw)).toEqual(inner)
  })

  it('result 是数组形式的 JSON 字符串', () => {
    const inner = [1, 2, 3]
    const raw = JSON.stringify({ result: JSON.stringify(inner), Error: '' })
    expect(parseBaseResult(raw)).toEqual(inner)
  })

  it('result 是普通字符串 → 透传', () => {
    const raw = JSON.stringify({ result: 'hello', Error: '' })
    expect(parseBaseResult(raw)).toBe('hello')
  })

  it('result 是数字/布尔/对象 → 直接透传（非字符串路径）', () => {
    expect(parseBaseResult(JSON.stringify({ result: 42, Error: '' }))).toBe(42)
    expect(parseBaseResult(JSON.stringify({ result: false, Error: '' }))).toBe(
      false,
    )
    const obj = { a: 1 }
    expect(
      parseBaseResult(JSON.stringify({ result: obj, Error: '' })),
    ).toEqual(obj)
  })
})
