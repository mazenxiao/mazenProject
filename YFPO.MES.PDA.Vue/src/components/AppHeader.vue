<template>
  <van-nav-bar
    :title="title"
    :left-text="showBack ? '返回' : ''"
    :left-arrow="showBack"
    :fixed="fixed"
    :placeholder="fixed"
    @click-left="onBack"
  >
    <template #right>
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  showBack?: boolean
  fixed?: boolean
}
withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  fixed: true,
})

const router = useRouter()
function onBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/home')
}
</script>
