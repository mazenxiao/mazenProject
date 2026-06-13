#!/usr/bin/env node
/**
 * 把当前构建的版本号写入 dist/version.json
 *
 * CI 部署时由 `pnpm build` 自动调用。
 * 部署完成后，已打开页面的浏览器会通过 plugins/updater.ts 比对版本号触发刷新。
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const target = path.join(distDir, 'version.json')

if (!fs.existsSync(distDir)) {
  console.error('[write-version] dist/ 不存在，先 vite build 再调用本脚本')
  process.exit(1)
}

let commit = 'unknown'
try {
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
} catch {
  // 非 git 仓库时跳过
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
)

const payload = {
  version: `${pkg.version}+${commit}`,
  buildTime: new Date().toISOString(),
  commit,
}

fs.writeFileSync(target, JSON.stringify(payload, null, 2), 'utf8')
console.log('[write-version] →', target, payload)
