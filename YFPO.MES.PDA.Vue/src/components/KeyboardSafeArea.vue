<template>
  <div class="kb-safe" :style="{ paddingBottom: pad + 'px' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 键盘弹起时给容器加底部 padding，避免软键盘遮挡焦点输入框
 * 注意：浏览器无法 100% 探测键盘高度，此处用 visualViewport 兜底
 */
const pad = ref(0)
let initial = 0

function onResize() {
  if (!window.visualViewport) return
  const cur = window.visualViewport.height
  if (initial === 0) initial = cur
  pad.value = Math.max(0, initial - cur)
}

onMounted(() => {
  window.visualViewport?.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.visualViewport?.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.kb-safe {
  transition: padding-bottom 0.2s ease;
}
</style>
