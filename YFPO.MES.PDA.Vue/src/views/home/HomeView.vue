<template>
  <div class="home-page">
    <AppHeader :title="t('home.menus')" :show-back="false">
      <template #right>
        <van-button size="mini" plain @click="onLogout">
          {{ t('common.logout') }}
        </van-button>
      </template>
    </AppHeader>

    <div class="home-page__profile">
      <div class="home-page__name">
        {{ t('home.welcome', { name: userName }) }}
      </div>
      <div class="home-page__meta">
        {{ t('common.factory') }}：{{ factoryName }} · v{{ version.current }}
      </div>
    </div>

    <div v-if="loading" class="home-page__loading">
      <van-loading size="24" vertical>{{ t('common.loading') }}</van-loading>
    </div>

    <div v-else-if="visiblePrograms.length === 0" class="home-page__empty">
      <van-empty :description="t('home.noPrograms')" />
    </div>

    <van-grid v-else :column-num="columns" :gutter="8" class="home-page__grid">
      <van-grid-item
        v-for="p in visiblePrograms"
        :key="p.ProgramID || p.ProgramCode"
        :icon="p.Icon || 'apps-o'"
        :text="p.ProgramName"
        @click="onProgramClick(p)"
      />
    </van-grid>

    <div class="home-page__footer">
      <van-button size="small" plain @click="clearCache">
        {{ t('home.clearCache') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页 —— 对应旧 HomePage
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { showConfirmDialog } from 'vant'
import { useI18n } from 'vue-i18n'
import {
  useUserStore,
  useCompanyStore,
  useProgramStore,
  useVersionStore,
} from '@/store'
import { UserOP } from '@/services/ops'
import { PAGE_LIST } from '@/router/pages'
import type { Program } from '@/models'
import AppHeader from '@/components/AppHeader.vue'

const { t } = useI18n()
const router = useRouter()
const user = useUserStore()
const companyStore = useCompanyStore()
const programStore = useProgramStore()
const version = useVersionStore()

const loading = ref(false)
const userName = computed(() => user.user?.UserName || user.user?.UserAccount || '-')
const factoryName = computed(() => companyStore.factory?.FactoryName || '-')

const breakpoints = useBreakpoints(breakpointsTailwind)
const columns = computed(() =>
  breakpoints.greaterOrEqual('lg').value
    ? 6
    : breakpoints.greaterOrEqual('md').value
      ? 4
      : breakpoints.greaterOrEqual('sm').value
        ? 3
        : 3,
)

/** 后端拉到的菜单 ⇒ 与本地路由表对接 */
const visiblePrograms = computed<Program[]>(() => {
  const fromBackend = programStore.programs
  if (fromBackend.length > 0) {
    // 过滤 RFID（v1.1 默认隐藏）
    return fromBackend.filter((p) => !isHiddenInBs(p))
  }
  // 兜底：用本地路由表前 12 项展示
  return PAGE_LIST
    .filter((p) => !p.meta.hiddenInBs && p.path !== '/home' && p.path !== '/login')
    .slice(0, 12)
    .map((p) => ({
      ProgramName: p.meta.title,
      ProgramCode: p.name,
      Url: p.path,
      Icon: 'apps-o',
    }))
})

function isHiddenInBs(p: Program): boolean {
  // 通过 ProgramCode/Url 关键字识别 RFID 类
  const code = (p.ProgramCode || p.Url || '').toLowerCase()
  return code.includes('rfid')
}

function onProgramClick(p: Program) {
  const url = p.Url || ''
  if (!url) return
  // 后端可能返回旧 ionic 页面名（FrmReceive…），需要做映射；
  // 此处简单按 path 直接 push，路由表里若不存在会落到 NotFound
  router.push(url.startsWith('/') ? url : '/' + url)
}

async function onLogout() {
  await showConfirmDialog({
    title: t('common.logout'),
    message: '确定要退出登录吗？',
  }).catch(() => null)
  user.logout()
  programStore.setPrograms([])
  router.replace('/login')
}

async function clearCache() {
  await showConfirmDialog({
    title: t('home.clearCache'),
    message: '清除缓存将退出登录，确认？',
  }).catch(() => null)
  localStorage.clear()
  location.reload()
}

async function loadPrograms() {
  if (!user.user?.UserAccount) return
  loading.value = true
  try {
    const list = await UserOP.GetUserAvailPrograms<Program[]>(
      user.user.UserAccount,
    )
    if (Array.isArray(list)) programStore.setPrograms(list)
  } catch (e: any) {
    console.warn('[home] GetUserAvailPrograms failed:', e?.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadPrograms)
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 24px;

  &__profile {
    background: #1989fa;
    color: #fff;
    padding: 12px 16px 16px;
  }
  &__name {
    font-size: 16px;
    font-weight: 600;
  }
  &__meta {
    font-size: 12px;
    opacity: 0.85;
    margin-top: 4px;
  }
  &__grid {
    margin: 12px 8px;
  }
  &__loading,
  &__empty {
    padding: 48px 0;
    text-align: center;
  }
  &__footer {
    text-align: center;
    margin-top: 24px;
  }
}
</style>
