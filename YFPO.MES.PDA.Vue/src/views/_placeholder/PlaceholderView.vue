<template>
  <div class="placeholder">
    <AppHeader :title="title" />
    <div class="placeholder__body">
      <van-empty :description="description">
        <template #default>
          <div class="placeholder__hint">
            <p><b>{{ title }}</b></p>
            <p class="placeholder__path">视图文件：{{ view }}</p>
            <p class="placeholder__memo">
              此页面尚未在 Vue 版本中实现，按 03-开发PRD 迭代 4–7 计划逐步替换为真实业务视图。
            </p>
          </div>
        </template>
      </van-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()

interface Props {
  meta?: { title?: string }
  view?: string
}
const props = defineProps<Props>()

const title = computed(
  () => props.meta?.title || (route.meta.title as string) || '占位页',
)
const view = computed(() => props.view || '(unknown)')

const description = computed(() => `${title.value} - 待实现`)
</script>

<style lang="scss" scoped>
.placeholder {
  min-height: 100vh;
  background: #f5f7fa;
  &__body {
    padding-top: 24px;
  }
  &__hint {
    text-align: center;
    color: #666;
    line-height: 1.7;
  }
  &__path {
    font-family: monospace;
    font-size: 12px;
    color: #999;
  }
  &__memo {
    font-size: 12px;
    color: #999;
    max-width: 280px;
    margin: 0 auto;
  }
}
</style>
