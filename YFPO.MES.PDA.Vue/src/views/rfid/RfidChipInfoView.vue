<template>
  <div class="rfid">
    <AppHeader title="RFID 芯片信息" />
    <van-empty :description="t('rfid.unsupported')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
const { t } = useI18n()
</script>

<style scoped>
.rfid {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
