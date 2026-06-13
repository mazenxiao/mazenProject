<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { startVersionWatch } from '@/plugins/updater'

onMounted(() => {
  // 隐藏初始 loader（CSS 已隐藏，这里再保险一次）
  document.getElementById('initial-loader')?.remove()
  startVersionWatch()
})
</script>
