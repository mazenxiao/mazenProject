/**
 * OP 服务统一出口
 *
 * 完整 189 个 OP 由 `scripts/codegen-ops.ts` 批量产出，按需 import。
 * 本文件目前只导出迭代 1/2 用到的几个，后续生成完毕后追加 export。
 */

export { UserOP } from './UserOP'
export { ComPanyOP, FactoryOP } from './CommonOP'
