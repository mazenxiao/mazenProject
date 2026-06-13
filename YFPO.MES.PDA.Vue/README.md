# YFPO.MES.PDA_Vue

YFPO MES PDA 前端升级 —— **BS 模式 Vue 3 版本**。基于 `YFPO/开发/方案/03-开发PRD-YFPO.MES.PDA前端升级.md` v1.1 实现。

## 当前进度

按 PRD 迭代计划，本仓库目前处于 **迭代 1（W1-W2 工程基线）+ 迭代 2 起步（登录 / 首页）+ 迭代 3 准备（codegen 骨架）** 状态：

| PRD 任务 ID | 任务 | 状态 | 说明 |
|---|---|---|---|
| T-001 | Vite + Vue 3 + TS 工程脚手架 | ✅ | `package.json` / `vite.config.ts` / `tsconfig.*` |
| T-002 | Vant + Element Plus + VXE-Table | ✅ | `src/main.ts` 注册 |
| T-003 | Pinia + Vue Router + i18n | ✅ | `src/store`、`src/router`、`src/locales` |
| T-004 | mesSend 适配器 + axios 拦截器 | ✅ | `src/services/{adapter,http}.ts` |
| T-005 | ~~Capacitor SendHelper Plugin~~ | – | v1.1 已删除 |
| T-006 | codegen-ops + codegen-models 脚本 | 🟡 骨架 | `scripts/codegen-{ops,models}.ts` |
| T-007 | ScanInput 组件（键盘 + 摄像头） | ✅ | `src/components/ScanInput.vue` |
| T-008 | DataGrid（vxe-table 二次封装） | ✅ | `src/components/DataGrid.vue` |
| T-009 | LoginView | ✅ | `src/views/login/LoginView.vue` |
| T-010 | HomeView | ✅ | `src/views/home/HomeView.vue` |
| T-011 | i18n 资源 | ✅ | `src/locales/{zh-CN,en}.json` |
| T-012 | updater + version.json | ✅ | `src/plugins/updater.ts` + `scripts/write-version.mjs` |
| T-013 | RFID 占位页 + hiddenInBs 过滤 | ✅ | `src/views/rfid/*` + `src/router/pages.ts` |
| T-014 | TTS / Device UUID 替代 | ✅ | `src/plugins/{tts,device}.ts` |
| T-015 | manifest.json + PWA 图标 | ✅ | `public/manifest.json` + `favicon.svg` |
| T-016~T-126 | 111 个业务页面 | 🟡 占位 | 全部路由已注册，未实现的指向 `_placeholder/PlaceholderView.vue` |
| T-127 | E2E 测试 | ⬜ | 等业务页面就绪后接入 Playwright |
| T-128 | 性能优化 | ⬜ | 上线前 |
| T-129 | 灰度发布 & 监控 | ⬜ | 部署阶段 |

`✅` 已完成 · `🟡` 部分完成（需后续补强）· `⬜` 未开始 · `–` 已废弃

## 目录结构

```
YFPO.MES.PDA_Vue/
├─ package.json
├─ vite.config.ts                  # base=/mes-pda/，dev 代理到 WebAppRoute
├─ tsconfig.json / tsconfig.app.json / tsconfig.node.json
├─ vitest.config.ts
├─ index.html                      # 含初始 loader、manifest 引用
├─ public/
│  ├─ manifest.json                # PWA "添加到主屏"
│  └─ favicon.svg
├─ src/
│  ├─ main.ts                      # 入口：Pinia + Router + i18n + Vant + ElementPlus + VXE
│  ├─ App.vue                      # 根组件 + 启动 updater
│  ├─ env.d.ts                     # Vite/Vue 类型补丁
│  ├─ router/
│  │  ├─ index.ts                  # createRouter + 全局守卫
│  │  └─ pages.ts                  # 113 页面清单（与 PRD 附录 A 一致）
│  ├─ store/
│  │  ├─ user.ts / company.ts / factories.ts / program.ts / ui.ts / version.ts
│  │  └─ index.ts
│  ├─ services/
│  │  ├─ adapter.ts                # mesSend<T> + parseBaseResult（行为对齐旧 send）
│  │  ├─ http.ts                   # axios 实例 + 拦截器（5xx 重试、401 跳登录）
│  │  ├─ factories.ts              # 19 个工厂代码（v1.1 不再持有 WSDL URL）
│  │  └─ ops/
│  │     ├─ UserOP.ts              # 样例：Login / GetUserAvailPrograms / ChangePwd
│  │     ├─ CommonOP.ts            # 样例：ComPanyOP.GetAvailCompanies / FactoryOP.GetUserAvailFactories
│  │     └─ index.ts               # 统一出口（codegen 产物落到 generated.ts）
│  ├─ models/
│  │  ├─ Base.ts                   # BaseInformation_I / BaseInfomation_O / ClientInformation
│  │  └─ index.ts                  # User / Company / Factory / Program 等
│  ├─ plugins/
│  │  ├─ device.ts                 # Web-{uuid} 持久化（替代 Honeywell SN）
│  │  ├─ tts.ts                    # speechSynthesis 封装
│  │  ├─ updater.ts                # /version.json 轮询 + 强刷提示
│  │  └─ scanner.ts                # KeyboardScanner / CameraScanner
│  ├─ components/
│  │  ├─ ScanInput.vue             # 键盘流 + 摄像头扫码
│  │  ├─ DataGrid.vue              # vxe-table 封装
│  │  ├─ AppHeader.vue
│  │  ├─ KeyboardSafeArea.vue
│  │  └─ index.ts
│  ├─ views/
│  │  ├─ login/LoginView.vue
│  │  ├─ home/HomeView.vue
│  │  ├─ rfid/{RfidScanView,RfidChipInfoView}.vue   # v1.1 占位
│  │  └─ _placeholder/{PlaceholderView,NotFoundView}.vue
│  ├─ locales/{zh-CN,en}.json + index.ts
│  └─ styles/global.scss
├─ scripts/
│  ├─ codegen-ops.ts               # 旧 mes-service/*.service.ts → src/services/ops/*.ts
│  ├─ codegen-models.ts            # 旧 models/*.ts → src/models/generated/*.ts
│  └─ write-version.mjs            # 构建后写 dist/version.json
└─ tests/
   ├─ adapter.spec.ts              # parseBaseResult 行为对齐旧 send
   ├─ factories.spec.ts
   └─ pages.spec.ts
```

## 后端调用约定（v1.1 单一通道）

```
Vue 浏览器
  │
  │  axios.post('/api/mes/Home/Send', { ClientInfo, ClassName, FunctionName, Parameters, PersistenceCode })
  │
  ▼
WebAppRoute（IIS 同站）
  │  按 ClientInfo.CompanyCode 反查目标 WCF
  ▼
工厂 BaseService.svc（19 个，前端不暴露内网 IP）
```

- **路径**：`POST {VITE_API_BASE}/Home/Send`（开发 `/api/mes`，生产同站相对路径）
- **Body**：与旧 SOAP 包络的 JSON 化等价（`ClassName/FunctionName/Parameters/PersistenceCode/ClientInfo`）
- **Response**：`text/plain`，body 是 `BaseInfomation_O<string>` 的 JSON 字符串
- **解析**：`parseBaseResult` 严格对齐旧 `app-service.ts:send()` 中的分支（`tests/adapter.spec.ts` 兜底）

## 上手

```bash
# 1. 安装依赖
pnpm install

# 2. 开发模式（自动代理 /api/mes → http://10.250.16.85/WebAppRoute）
pnpm dev

# 3. 类型检查
pnpm typecheck

# 4. 单元测试
pnpm test

# 5. 生产构建（带 version.json）
pnpm build

# 6. 批量生成 OP / Model（首次跑前需要旧 IMES3.0 仓库就在 ../IMES3.0/YFPO.MES.PDA）
pnpm codegen:ops
pnpm codegen:models
```

## 部署形态

- **同源部署**：`dist/` 通过 IIS / Nginx 挂在 `/mes-pda/` 子路径，与 `WebAppRoute` 共用同一站点根域名
- **HTTPS**：建议开启（摄像头扫码、TTS 需要安全上下文）
- **回滚**：保留前一版 `dist-rollback/`，5 分钟内 rsync 切回
- **灰度**：α 10% → β 30% → γ 70% → GA 100%（旧 APK 入口并行不下线 1-2 个迭代）

## 后续工作

| 编号 | 工作项 | 触发条件 |
|---|---|---|
| W-1 | 跑 `codegen:ops` 落地 189 个 OP | 旧 IMES3.0 仓库已 clone 到 `../IMES3.0/YFPO.MES.PDA` |
| W-2 | 跑 `codegen:models` 落地 208 个 model | 同上 |
| W-3 | 按 PRD 迭代 4-7 替换 111 个占位页 | OP / Model 落地后 |
| W-4 | 接入 ESLint / Prettier / Husky pre-commit | 团队进场前 |
| W-5 | Playwright E2E 用例（30 条主链路） | 业务页面就绪后 |
| W-6 | 真机适配验收（EDA52 / TC21 / 手机 / Edge） | 灰度前 |

## 关联文档

- [01-需求登记](../方案/01-需求登记-YFPO.MES.PDA前端升级.md)
- [02-解决方案](../方案/02-解决方案-YFPO.MES.PDA前端升级.md)
- [03-开发PRD](../方案/03-开发PRD-YFPO.MES.PDA前端升级.md) ← 本仓库实现依据
- [04-技术分析-BS模式后端调用方案](../方案/04-技术分析-BS模式后端调用方案.md)
- [05-技术分析-多厂部署架构选型](../方案/05-技术分析-多厂部署架构选型.md)
- [06-技术分析-技术栈版本选型与核心工具说明](../方案/06-技术分析-技术栈版本选型与核心工具说明.md)
