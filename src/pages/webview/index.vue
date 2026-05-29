<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const url = ref('')

onLoad((options) => {
  if (options?.url) {
    url.value = decodeURIComponent(options.url)
  }
})
</script>

<template>
  <web-view v-if="url" :src="url" />
  <view v-else class="empty-webview">
    <text>暂无可加载的页面</text>
  </view>
</template>

<style lang="scss" scoped>
.empty-webview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--color-text-placeholder);
}
</style>
