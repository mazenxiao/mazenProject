/**
 * 113 个业务页面路由清单
 *
 * 与 03-开发PRD §附录 A "113 页面迁移对照表" 1:1 对齐。
 *
 * 当前状态：
 *   - login / home：已实现（迭代 2 落地）
 *   - rfid 2 项：占位页（v1.1 默认隐藏菜单，meta.hiddenInBs = true）
 *   - 其余 110 项：占位页 (`_placeholder/PlaceholderView.vue`)，
 *     按迭代 4–7 计划逐步替换为真实业务视图
 */
import type { RouteRecordRaw } from 'vue-router'

const Placeholder = () => import('@/views/_placeholder/PlaceholderView.vue')

interface PageMeta {
  title: string
  /** v1.1：BS 模式下隐藏菜单（RFID 等），但路由可访问，显示占位页 */
  hiddenInBs?: boolean
  /** 是否需要登录（默认 true） */
  requiresAuth?: boolean
}

interface PageRoute {
  path: string
  name: string
  view: string // src/views 下的相对路径
  meta: PageMeta
}

/** 已实现的视图映射 */
const implemented: Record<string, () => Promise<unknown>> = {
  'login/LoginView.vue': () => import('@/views/login/LoginView.vue'),
  'home/HomeView.vue': () => import('@/views/home/HomeView.vue'),
  'rfid/RfidScanView.vue': () => import('@/views/rfid/RfidScanView.vue'),
  'rfid/RfidChipInfoView.vue': () => import('@/views/rfid/RfidChipInfoView.vue'),
}

/** 113 页面清单，与 PRD 附录 A 一致 */
const PAGES: PageRoute[] = [
  // 登录 / 首页
  { path: '/login', name: 'login', view: 'login/LoginView.vue', meta: { title: '登录', requiresAuth: false } },
  { path: '/home', name: 'home', view: 'home/HomeView.vue', meta: { title: '首页' } },

  // 收货
  { path: '/receive', name: 'receive', view: 'receive/ReceiveView.vue', meta: { title: '收货' } },
  { path: '/receive/on-shelf', name: 'receive-on-shelf', view: 'receive/ReceiveOnShelfView.vue', meta: { title: '收货上架' } },
  { path: '/receive/on-shelf-second', name: 'receive-on-shelf-second', view: 'receive/ReceiveOnShelfSecondView.vue', meta: { title: '收货上架(二次)' } },
  { path: '/receive/frozen', name: 'frozen-receive', view: 'receive/FrozenReceiveView.vue', meta: { title: '冻结收货' } },

  // 发货
  { path: '/delivery', name: 'delivery', view: 'delivery/DeliveryView.vue', meta: { title: '发货' } },
  { path: '/delivery/new', name: 'new-delivery', view: 'delivery/NewDeliveryView.vue', meta: { title: '新发货' } },
  { path: '/delivery/check', name: 'deliver-check', view: 'delivery/DeliverCheckView.vue', meta: { title: '发货校验' } },
  { path: '/delivery/check-bj', name: 'deliver-check-bj', view: 'delivery/DeliverCheckBjView.vue', meta: { title: '发货校验(BJ)' } },
  { path: '/delivery/check-auto', name: 'deliver-check-auto', view: 'delivery/DeliverCheckAutoView.vue', meta: { title: '发货校验(自动)' } },
  { path: '/delivery/check-new', name: 'deliver-check-new', view: 'delivery/DeliverCheckNewView.vue', meta: { title: '发货校验(新)' } },

  // 装运 / 出库
  { path: '/shipping/cs-order-ckb', name: 'cs-shipping-order-ckb', view: 'shipping/CsShippingOrderCkbView.vue', meta: { title: '常熟出货校验' } },
  { path: '/shipping/loading-check', name: 'loading-check', view: 'shipping/LoadingCheckView.vue', meta: { title: '装车校验' } },
  { path: '/shipping/order-check', name: 'shipping-order-check', view: 'shipping/ShippingOrderCheckView.vue', meta: { title: '发货单校验' } },
  { path: '/shipping/error-prevention', name: 'shipping-error-prevention', view: 'shipping/ShippingErrorPreventionView.vue', meta: { title: '发货防错' } },
  { path: '/shipping/verification', name: 'shipping-verification', view: 'shipping/ShippingVerificationView.vue', meta: { title: '发货核对' } },
  { path: '/shipping/pokayoka', name: 'ship-pokayoka', view: 'shipping/ShipPokayokaView.vue', meta: { title: '发货防呆' } },

  // 库位 / 上下架
  { path: '/bin/check', name: 'bin-check', view: 'bin/BinCheckView.vue', meta: { title: '库位盘点' } },
  { path: '/bin/down-rec', name: 'bin-down-rec', view: 'bin/BinDownRecView.vue', meta: { title: '下架记录' } },
  { path: '/bin/replace', name: 'bin-replace', view: 'bin/BinReplaceView.vue', meta: { title: '库位替换' } },
  { path: '/bin/select', name: 'bin-select', view: 'bin/BinSelectView.vue', meta: { title: '库位选择' } },
  { path: '/bin/down-freeze-desponse', name: 'down-bin-freeze-desponse', view: 'bin/DownBinFreezeDesponseView.vue', meta: { title: '冻结下架处置' } },
  { path: '/bin/down-pushing', name: 'down-bin-pushing', view: 'bin/DownBinPushingView.vue', meta: { title: '推送下架' } },
  { path: '/bin/to-up', name: 'to-up-bin', view: 'bin/ToUpBinView.vue', meta: { title: '上架到库位' } },
  { path: '/bin/up-request-group', name: 'up-bin-request-group', view: 'bin/UpBinRequestGroupView.vue', meta: { title: '上架请求组' } },

  // 库存 / 转移
  { path: '/stock/down-request-out', name: 'down-request-out-stock', view: 'stock/DownRequestOutStockView.vue', meta: { title: '下架出库请求' } },
  { path: '/stock/lx-in', name: 'lx-in-stock', view: 'stock/LxInStockView.vue', meta: { title: '零星入库' } },
  { path: '/stock/manual-in', name: 'manual-in-stock', view: 'stock/ManualInStockView.vue', meta: { title: '手工入库' } },
  { path: '/stock/manual-in-affair', name: 'manual-in-stock-affair', view: 'stock/ManualInStockAffairView.vue', meta: { title: '手工入库事务' } },
  { path: '/stock/manual-in-sn', name: 'manual-in-stock-by-sn', view: 'stock/ManualInStockBySnView.vue', meta: { title: '按 SN 手工入库' } },
  { path: '/stock/manual-out', name: 'manual-out-stock', view: 'stock/ManualOutStockView.vue', meta: { title: '手工出库' } },
  { path: '/stock/manual-out-sn', name: 'manual-out-stock-by-sn', view: 'stock/ManualOutStockBySnView.vue', meta: { title: '按 SN 手工出库' } },
  { path: '/stock/manual-out-new', name: 'manual-out-stock-new', view: 'stock/ManualOutStockNewView.vue', meta: { title: '手工出库(新)' } },
  { path: '/stock/manual-trans', name: 'manual-trans', view: 'stock/ManualTransView.vue', meta: { title: '手工转移' } },

  // AGV
  { path: '/agv/assembly-market', name: 'agv-assembly-market', view: 'agv/AgvAssemblyMarketView.vue', meta: { title: 'AGV 装配超市' } },
  { path: '/agv/prod-feed', name: 'agv-prod-feed', view: 'agv/AgvProdFeedView.vue', meta: { title: 'AGV 投料' } },
  { path: '/agv/return-execute', name: 'agv-return-execute', view: 'agv/AgvReturnExecuteView.vue', meta: { title: 'AGV 回收执行' } },
  { path: '/agv/hanld-prod-feed', name: 'hanld-prod-feed', view: 'agv/HanldProdFeedView.vue', meta: { title: '手持投料' } },
  { path: '/agv/prod-feed-base', name: 'prod-feed', view: 'agv/ProdFeedView.vue', meta: { title: '生产投料' } },
  { path: '/agv/tx-down-floor', name: 'tx-agv-down-floor', view: 'agv/TxAgvDownFloorView.vue', meta: { title: 'TX AGV 下楼层' } },

  // HU / 容器 / 包装
  { path: '/hu/binding-to-rk', name: 'hu-binding-to-rk', view: 'hu/HuBindingToRkView.vue', meta: { title: 'HU 绑定到 RK' } },
  { path: '/hu/pokayoke', name: 'hu-pokayoke', view: 'hu/HuPokayokeView.vue', meta: { title: 'HU 防呆' } },
  { path: '/hu/replace-pda', name: 'hu-replace-pda', view: 'hu/HuReplacePdaView.vue', meta: { title: 'HU 替换' } },
  { path: '/hu/cust-vda-scan', name: 'cust-hu-vda-hu-scan', view: 'hu/CustHuVdaScanView.vue', meta: { title: '客户 HU/VDA 扫描' } },
  { path: '/container/pkg', name: 'container-pkg', view: 'container/ContainerPkgView.vue', meta: { title: '容器包装' } },
  { path: '/package', name: 'pkg', view: 'package/PkgView.vue', meta: { title: '包装' } },
  { path: '/package/pallet-packing', name: 'ref-frm-pallet-packing', view: 'package/PalletPackingView.vue', meta: { title: '托盘装箱' } },

  // 挂具
  { path: '/hanger/back', name: 'hanger-back', view: 'hanger/HangerBackView.vue', meta: { title: '挂具回收' } },
  { path: '/hanger/in', name: 'hanger-in', view: 'hanger/HangerInView.vue', meta: { title: '挂具入库' } },
  { path: '/hanger/out', name: 'hanger-out', view: 'hanger/HangerOutView.vue', meta: { title: '挂具出库' } },
  { path: '/hanger/information', name: 'hanger-information', view: 'hanger/HangerInformationView.vue', meta: { title: '挂具信息' } },
  { path: '/hanger/maintain', name: 'hanger-maintain', view: 'hanger/HangerMaintainView.vue', meta: { title: '挂具维护' } },
  { path: '/hanger/no-scald-maintain', name: 'no-scald-hanger-maintain', view: 'hanger/NoScaldHangerMaintainView.vue', meta: { title: '免烫挂具维护' } },

  // 条码 / 绑定
  { path: '/barcode/check', name: 'barcode-check', view: 'barcode/BarcodeCheckView.vue', meta: { title: '条码校验' } },
  { path: '/barcode/config-change', name: 'barcode-config-change', view: 'barcode/BarcodeConfigChangeView.vue', meta: { title: '条码配置变更' } },
  { path: '/barcode/manual-bind', name: 'manual-bind', view: 'barcode/ManualBindView.vue', meta: { title: '手工绑定' } },
  { path: '/barcode/manual-unbind', name: 'manual-unbind', view: 'barcode/ManualUnbindView.vue', meta: { title: '手工解绑' } },
  { path: '/barcode/plugin-remove-bind', name: 'plugin-remove-bind-barcode', view: 'barcode/PluginRemoveBindBarcodeView.vue', meta: { title: '附件解绑' } },
  { path: '/barcode/uc-check', name: 'uc-bar-code-check', view: 'barcode/UcBarCodeCheckView.vue', meta: { title: 'UC 条码校验' } },
  { path: '/barcode/uc-check-new', name: 'uc-bar-code-check-new', view: 'barcode/UcBarCodeCheckNewView.vue', meta: { title: 'UC 条码校验(新)' } },
  { path: '/barcode/uc-box-check', name: 'uc-box-check', view: 'barcode/UcBoxCheckView.vue', meta: { title: 'UC 箱校验' } },
  { path: '/barcode/uc-box-check-vw', name: 'uc-box-check-vw', view: 'barcode/UcBoxCheckVwView.vue', meta: { title: 'UC 箱校验(VW)' } },

  // 胶罐
  { path: '/gluecan/bind', name: 'gluecan-bind', view: 'gluecan/GluecanBindView.vue', meta: { title: '胶罐绑定' } },
  { path: '/gluecan/unbind', name: 'gluecan-unbind', view: 'gluecan/GluecanUnbindView.vue', meta: { title: '胶罐解绑' } },

  // 质检
  { path: '/quality/error-proofing-check', name: 'error-proofing-check', view: 'quality/ErrorProofingCheckView.vue', meta: { title: '防错校验' } },
  { path: '/quality/error-proofing-type', name: 'error-proofing-type', view: 'quality/ErrorProofingTypeView.vue', meta: { title: '防错类型' } },
  { path: '/quality/isolated', name: 'isolated', view: 'quality/IsolatedView.vue', meta: { title: '隔离品' } },
  { path: '/quality/suspect-verification', name: 'suspect-prod-verification', view: 'quality/SuspectProdVerificationView.vue', meta: { title: '可疑品验证' } },
  { path: '/quality/suspect-verification-operat', name: 'suspect-prod-verification-operat', view: 'quality/SuspectProdVerificationOperatView.vue', meta: { title: '可疑品验证操作' } },
  { path: '/quality/update-status', name: 'update-quality-status', view: 'quality/UpdateQualityStatusView.vue', meta: { title: '更新质量状态' } },

  // 盘点
  { path: '/stocktaking/select', name: 'stocktaking-select', view: 'stocktaking/StocktakingSelectView.vue', meta: { title: '盘点选择' } },
  { path: '/stocktaking/storage-up-down', name: 'storage-up-down', view: 'stocktaking/StorageUpDownView.vue', meta: { title: '库存上下架' } },

  // JIS / Tesla
  { path: '/jis/order-check', name: 'jis-order-check', view: 'jis/JisOrderCheckView.vue', meta: { title: 'JIS 订单校验' } },
  { path: '/jis/order-seq-check', name: 'jis-order-seq-check', view: 'jis/JisOrderSeqCheckView.vue', meta: { title: 'JIS 顺序校验' } },
  { path: '/jis/bba-order-seq-check', name: 'bba-jis-order-seq-check', view: 'jis/BbaJisOrderSeqCheckView.vue', meta: { title: 'BBA JIS 顺序校验' } },
  { path: '/jis/sequencing-check', name: 'seqencing-check', view: 'jis/SeqencingCheckView.vue', meta: { title: '排序校验' } },
  { path: '/jis/tesla-shipment', name: 'tesla-jis-shipment', view: 'jis/TeslaJisShipmentView.vue', meta: { title: '特斯拉 JIS 发运' } },

  // ASN
  { path: '/asn/check-list', name: 'asn-check-list', view: 'asn/AsnCheckListView.vue', meta: { title: 'ASN 校验单' } },
  { path: '/asn/check-reorder', name: 'asn-check-reorder', view: 'asn/AsnCheckReorderView.vue', meta: { title: 'ASN 重新排序' } },
  { path: '/asn/error-check', name: 'asn-error-check', view: 'asn/AsnErrorCheckView.vue', meta: { title: 'ASN 错误校验' } },
  { path: '/asn/instruction-out', name: 'asn-instruction-out', view: 'asn/AsnInstructionOutView.vue', meta: { title: 'ASN 出库指令' } },

  // 装配 / 检测
  { path: '/assembly', name: 'assembly', view: 'assembly/AssemblyView.vue', meta: { title: '装配' } },
  { path: '/preasm/scan', name: 'pda-pre-asm-scan', view: 'preasm/PdaPreAsmScanView.vue', meta: { title: '预装配扫描' } },
  { path: '/production/on-line-follow', name: 'production-on-line-follow', view: 'production/ProductionOnLineFollowView.vue', meta: { title: '在线生产跟踪' } },

  // 指令出/入库
  { path: '/instruction/out-let', name: 'instruction-out-let', view: 'instruction/InstructionOutLetView.vue', meta: { title: '出库指令' } },
  { path: '/instruction/out-let-second', name: 'instruction-out-let-second', view: 'instruction/InstructionOutLetSecondView.vue', meta: { title: '出库指令(二次)' } },
  { path: '/instruction/storage', name: 'instruction-storage', view: 'instruction/InstructionStorageView.vue', meta: { title: '入库指令' } },
  { path: '/instruction/storage-second', name: 'instruction-storage-second', view: 'instruction/InstructionStorageSecondView.vue', meta: { title: '入库指令(二次)' } },
  { path: '/instruction/trans-out-let', name: 'trans-instruction-out-let', view: 'instruction/TransInstructionOutLetView.vue', meta: { title: '转移出库指令' } },

  // 客户件 / 备件
  { path: '/cust/pro-return', name: 'pro-cust-return', view: 'cust/ProCustReturnView.vue', meta: { title: '客户件退回' } },
  { path: '/cust/pro-send', name: 'pro-cust-send', view: 'cust/ProCustSendView.vue', meta: { title: '客户件发出' } },
  { path: '/spareparts/off-shelf', name: 'and-spare-parts-off-shelf', view: 'spareparts/SparePartsOffShelfView.vue', meta: { title: '备件下架' } },
  { path: '/parts/lcl', name: 'lcl-parts', view: 'parts/LclPartsView.vue', meta: { title: '零件 LCL' } },

  // 清理 / 其它
  { path: '/clear/cust-scan-log', name: 'clear-CustScanLog', view: 'clear/ClearCustScanLogView.vue', meta: { title: '清除客户扫码日志' } },
  { path: '/clear/g48-g4x', name: 'clear-G48andG4X', view: 'clear/ClearG48G4XView.vue', meta: { title: '清除 G48/G4X' } },
  { path: '/clear/rk-to-hu', name: 'clear-rk-to-hu', view: 'clear/ClearRkToHuView.vue', meta: { title: '清除 RK→HU' } },
  { path: '/clear/rack', name: 'frmclearrack', view: 'clear/ClearRackView.vue', meta: { title: '清除货架' } },
  { path: '/charging', name: 'charging', view: 'charging/ChargingView.vue', meta: { title: '充电' } },
  { path: '/crushing/scanning', name: 'crushing-scanning', view: 'crushing/CrushingScanningView.vue', meta: { title: '破碎扫描' } },
  { path: '/express/card', name: 'express-card', view: 'express/ExpressCardView.vue', meta: { title: '发货卡' } },

  // 器具 / 工装
  { path: '/appliance/manage', name: 'appliance-manage', view: 'appliance/ApplianceManageView.vue', meta: { title: '器具管理' } },
  { path: '/appliance/empty', name: 'empty-appliance', view: 'appliance/EmptyApplianceView.vue', meta: { title: '空器具' } },

  // 固定位
  { path: '/fixpos/bind', name: 'fixpos-bind', view: 'fixpos/FixposBindView.vue', meta: { title: '固定位绑定' } },
  { path: '/fixpos/bind-select', name: 'fixpos-bind-select', view: 'fixpos/FixposBindSelectView.vue', meta: { title: '固定位绑定选择' } },
  { path: '/pos/switch-place', name: 'pos-switch-place', view: 'pos/PosSwitchPlaceView.vue', meta: { title: '位置切换' } },

  // 物料查询
  { path: '/inquiry/material', name: 'material-inquiry', view: 'inquiry/MaterialInquiryView.vue', meta: { title: '物料查询' } },

  // RK
  { path: '/rk/replace', name: 'rk-replace', view: 'rk/RkReplaceView.vue', meta: { title: 'RK 替换' } },
  { path: '/rk/select', name: 'rk-select', view: 'rk/RkSelectView.vue', meta: { title: 'RK 选择' } },
  { path: '/rk/up-empty-in-bin', name: 'up-empty-rk-in-bin', view: 'rk/UpEmptyRkInBinView.vue', meta: { title: '空 RK 上架到库位' } },
  { path: '/rk/up-empty-out-bin', name: 'up-empty-rk-out-bin', view: 'rk/UpEmptyRkOutBinView.vue', meta: { title: '空 RK 出库位' } },

  // RFID（v1.1：默认隐藏菜单）
  { path: '/rfid/scan', name: 'rfid-scan', view: 'rfid/RfidScanView.vue', meta: { title: 'RFID 扫描', hiddenInBs: true } },
  { path: '/rfid/chip-info', name: 'sa-frm-rfid-chip-info', view: 'rfid/RfidChipInfoView.vue', meta: { title: 'RFID 芯片信息', hiddenInBs: true } },
]

export const PAGE_LIST = PAGES

/** 把 PAGES 转成 RouteRecordRaw —— 已实现的视图正常 import，未实现的指向 Placeholder */
export function buildRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = PAGES.map((p): RouteRecordRaw => {
    const loader = implemented[p.view] ?? Placeholder
    return {
      path: p.path,
      name: p.name,
      component: loader,
      props: { meta: p.meta, view: p.view },
      meta: {
        title: p.meta.title,
        requiresAuth: p.meta.requiresAuth ?? true,
        hiddenInBs: p.meta.hiddenInBs ?? false,
      },
    } as RouteRecordRaw
  })

  // 兜底
  routes.unshift({ path: '/', redirect: '/home' })
  routes.push({
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/_placeholder/NotFoundView.vue'),
    meta: { title: '页面不存在', requiresAuth: false },
  })

  return routes
}
