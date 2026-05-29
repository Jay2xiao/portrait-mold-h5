<script setup lang="ts">
defineProps<{
  status: 'loading' | 'no-more' | 'idle'
}>()
</script>

<template>
  <view class="load-more">
    <view v-if="status === 'loading'" class="loading-wrap">
      <view class="loading-dot" />
      <text class="loading-text">加载中...</text>
    </view>
    <text v-else-if="status === 'no-more'" class="no-more-text">— 没有更多了 —</text>
  </view>
</template>

<style lang="scss" scoped>
.load-more {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg) 0;
}
.loading-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.loading-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  border: 3rpx solid var(--color-primary);
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-text {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
.no-more-text {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
</style>
