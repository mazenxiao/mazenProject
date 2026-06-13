<template>
  <div class="not-found">
    <van-empty image="error" description="页面不存在" />
    <div style="text-align: center">
      <van-button type="primary" size="small" @click="$router.replace('/home')">
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  padding-top: 12vh;
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
