/**
 * codegen-models —— 把旧 Ionic models/*.ts 批量迁移为新 Vue 工程的纯 interface
 *
 * 输入：../IMES3.0/YFPO.MES.PDA/src/models/*.ts （208 个）
 * 输出：./src/models/generated/*.ts
 *
 * 转换规则：
 *   - class Foo { a: string; b: number }  →  export interface Foo { a: string; b: number }
 *   - 保留枚举（直接复制，移除 @Injectable 等装饰器）
 *   - 不处理方法（DTO 类几乎不带方法）
 *
 * ⚠️ 当前为骨架版，扫描清单 + 输出统计；完整字段重建在落地时联调。
 */
import { Project, SyntaxKind } from 'ts-morph'
import path from 'node:path'
import fs from 'node:fs'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const LEGACY_DIR = path.resolve(
  ROOT,
  '../IMES3.0/YFPO.MES.PDA/src/models',
)
const OUT_DIR = path.resolve(ROOT, 'src/models/generated')

function listFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) listFiles(p, files)
    else if (ent.name.endsWith('.ts')) files.push(p)
  }
  return files
}

function convert(text: string): string {
  let out = text
  // 移除 import
  out = out.replace(/^import .*?;?\s*$/gm, '')
  // 移除 @Injectable / @decorator 行
  out = out.replace(/^\s*@\w+\([^)]*\)\s*$/gm, '')
  // class Xxx { ... }   →   export interface Xxx { ... }
  out = out.replace(/export\s+class\s+(\w+)\s*\{/g, 'export interface $1 {')
  out = out.replace(/^class\s+(\w+)\s*\{/gm, 'export interface $1 {')
  // 把成员的 public/private/readonly 修饰符去掉
  out = out.replace(/^\s*(public|private|protected|readonly)\s+/gm, '  ')
  return out.trim() + '\n'
}

function main() {
  const files = listFiles(LEGACY_DIR)
  if (!files.length) {
    console.warn('[codegen-models] 找不到旧目录：', LEGACY_DIR)
    return
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  let ok = 0
  for (const f of files) {
    try {
      const rel = path.relative(LEGACY_DIR, f)
      const dst = path.join(OUT_DIR, rel)
      fs.mkdirSync(path.dirname(dst), { recursive: true })
      const text = fs.readFileSync(f, 'utf8')
      fs.writeFileSync(dst, convert(text), 'utf8')
      ok++
    } catch (e: any) {
      console.error('  [error]', f, e?.message)
    }
  }
  console.log(`[codegen-models] 完成：${ok} 个文件 → ${OUT_DIR}`)
  // 显式引用 SyntaxKind 防止 unused-import（占位，后续若需要 AST 改写会用到）
  void SyntaxKind
  void Project
}

main()
