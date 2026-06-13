<template>
  <div class="rfid">
    <AppHeader title="RFID 扫描" />
    <van-empty :description="t('rfid.unsupported')" />
    <div class="rfid__hint">
      <p>v1.1 默认方案：浏览器无原生 RFID 能力，本功能在 PDA 客户端使用。</p>
      <p>如需在浏览器使用，请等待"工厂 RFID 中间件方案"独立立项。</p>
    </div>
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
.rfid__hint {
  padding: 0 24px;
  text-align: center;
  color: #999;
  font-size: 12px;
  line-height: 1.8;
}
</style>
