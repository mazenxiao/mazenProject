/**
 * codegen-ops —— 把旧 Ionic mes-service/*.service.ts 批量翻译成 Vue 版 OP 文件
 *
 * 输入：../IMES3.0/YFPO.MES.PDA/src/providers/mes-service/*.service.ts （189 个）
 * 输出：./src/services/ops/*.ts
 *
 * 强制规则（与 02 解决方案 §2.5 一致）：
 *   1. ClassName 字段照抄
 *   2. Parameters 顺序、Name、TypeName 照抄
 *   3. PersistenceCode、FunctionName 照抄
 *   4. 不允许人工再改产物，要改请改本脚本
 *
 * 用法：
 *   pnpm codegen:ops
 *
 * ⚠️ 当前为骨架版，能力：
 *   - 扫描旧目录，列出文件清单
 *   - 解析每个 OP 类的 Name、方法名、Parameters
 *   - 渲染 Vue 版 .ts 输出
 * 落地完整 189 个 OP 时，需要先 `pnpm i ts-morph` 并跑一次本脚本。
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
  '../IMES3.0/YFPO.MES.PDA/src/providers/mes-service',
)
const OUT_DIR = path.resolve(ROOT, 'src/services/ops')

interface OpParam {
  name: string
  typeName: string
}

interface OpMethod {
  name: string
  funcName: string
  params: OpParam[]
}

interface OpClass {
  fileName: string
  className: string
  classNameLiteral: string
  persistenceCode: string
  methods: OpMethod[]
}

function listLegacyFiles(): string[] {
  if (!fs.existsSync(LEGACY_DIR)) {
    console.warn('[codegen-ops] 找不到旧目录，跳过：', LEGACY_DIR)
    return []
  }
  return fs
    .readdirSync(LEGACY_DIR)
    .filter((f) => f.endsWith('.service.ts'))
    .map((f) => path.join(LEGACY_DIR, f))
}

function parseFile(file: string, project: Project): OpClass | null {
  const sf = project.addSourceFileAtPath(file)
  const cls = sf.getClasses()[0]
  if (!cls) return null

  // Name 字段
  const nameProp = cls.getProperty('Name')
  const classNameLiteral =
    nameProp?.getInitializer()?.getText().replace(/^['"]|['"]$/g, '') ?? ''

  // PersistenceCode（多数 OP 都有这个常量）
  let persistenceCode = ''
  const pcProp = cls.getProperty('PersistenceCode')
  if (pcProp) {
    persistenceCode =
      pcProp.getInitializer()?.getText().replace(/^['"]|['"]$/g, '') ?? ''
  }

  // 方法
  const methods: OpMethod[] = []
  cls.getMethods().forEach((m) => {
    const name = m.getName()
    if (name.startsWith('_')) return
    // 找方法体里的 Parameters.push(...)
    const paramsList: OpParam[] = []
    m.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
      const expr = call.getExpression().getText()
      if (!expr.endsWith('.push')) return
      const objArg = call.getArguments()[0]
      if (!objArg || objArg.getKind() !== SyntaxKind.ObjectLiteralExpression)
        return
      const ole: any = objArg
      const pName = ole
        .getProperty?.('Name')
        ?.getInitializer?.()
        ?.getText()
        ?.replace(/^['"]|['"]$/g, '')
      const pType = ole
        .getProperty?.('TypeName')
        ?.getInitializer?.()
        ?.getText()
        ?.replace(/^['"]|['"]$/g, '')
      if (pName) paramsList.push({ name: pName, typeName: pType ?? '' })
    })
    methods.push({ name, funcName: name, params: paramsList })
  })

  return {
    fileName: path.basename(file).replace('.service.ts', ''),
    className: cls.getName() ?? path.basename(file),
    classNameLiteral,
    persistenceCode,
    methods,
  }
}

function render(op: OpClass): string {
  const lines: string[] = []
  lines.push(`/**`)
  lines.push(` * ${op.className}（自动生成 —— 请勿手工修改）`)
  lines.push(` * 来源：${op.fileName}.service.ts`)
  lines.push(` */`)
  lines.push(`import { mesSend } from '@/services/adapter'`)
  lines.push(``)
  lines.push(`const ClassName = ${JSON.stringify(op.classNameLiteral)}`)
  lines.push(`const PersistenceCode = ${JSON.stringify(op.persistenceCode)}`)
  lines.push(``)
  lines.push(`export const ${op.className} = {`)
  op.methods.forEach((m, i) => {
    const argList = m.params.map((p) => `${p.name}: any`).join(', ')
    lines.push(`  ${m.funcName}<T = any>(${argList}): Promise<T> {`)
    lines.push(`    return mesSend<T>({`)
    lines.push(`      ClassName,`)
    lines.push(`      FunctionName: ${JSON.stringify(m.funcName)},`)
    lines.push(`      PersistenceCode,`)
    lines.push(`      Parameters: [`)
    m.params.forEach((p) => {
      lines.push(`        { Name: ${JSON.stringify(p.name)}, Value: ${p.name}, TypeName: ${JSON.stringify(p.typeName)} },`)
    })
    lines.push(`      ],`)
    lines.push(`    })`)
    lines.push(`  }${i < op.methods.length - 1 ? ',' : ''}`)
  })
  lines.push(`}`)
  lines.push(``)
  return lines.join('\n')
}

function main() {
  const files = listLegacyFiles()
  if (!files.length) return

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const project = new Project({
    compilerOptions: { allowJs: true, target: 99 },
    skipAddingFilesFromTsConfig: true,
  })

  const exports: string[] = []
  let ok = 0
  let fail = 0
  for (const f of files) {
    try {
      const op = parseFile(f, project)
      if (!op || !op.classNameLiteral) {
        console.warn('  [skip]', path.basename(f), '(无 Name 字段)')
        fail++
        continue
      }
      const out = path.join(OUT_DIR, op.className + '.ts')
      fs.writeFileSync(out, render(op), 'utf8')
      exports.push(`export { ${op.className} } from './${op.className}'`)
      ok++
    } catch (e: any) {
      console.error('  [error]', path.basename(f), e?.message)
      fail++
    }
  }

  // 不覆盖手写的 index.ts，单独写 generated 文件
  fs.writeFileSync(
    path.join(OUT_DIR, 'generated.ts'),
    [
      '/* 自动生成，请勿手工修改。运行 pnpm codegen:ops 重新生成。 */',
      ...exports,
      '',
    ].join('\n'),
    'utf8',
  )
  console.log(`[codegen-ops] 完成：${ok} 个 OP，${fail} 个跳过/失败`)
}

main()
