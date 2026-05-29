<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'order' | 'address' | 'search' | 'review' | 'favorite' | 'default'
  text?: string
  btnText?: string
}>(), {
  type: 'default',
  text: '暂无数据',
  btnText: ''
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const iconMap: Record<string, string> = {
  order: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  address: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
  search: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z',
  review: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  favorite: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  default: 'M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3z'
}

const textMap: Record<string, string> = {
  order: '暂无订单',
  address: '暂无收货地址',
  search: '未找到相关结果',
  review: '暂无评价',
  favorite: '暂无收藏',
  default: '暂无数据'
}
</script>

<template>
  <view class="empty-state">
    <view class="empty-icon">
      <view class="empty-icon-inner">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="40px" height="40px" fill="#B2BEC3">
          <path :d="iconMap[type]" />
        </svg>
        <!-- #endif -->
      </view>
    </view>
    <text class="empty-text">{{ text || textMap[type] }}</text>
    <view v-if="btnText" class="empty-btn" @tap="emit('action')">
      <text>{{ btnText }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}
.empty-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background-color: var(--color-bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.empty-icon-inner {
  width: 80rpx;
  height: 80rpx;
}
.empty-text {
  font-size: var(--font-base);
  color: var(--color-text-placeholder);
  margin-bottom: var(--spacing-lg);
}
.empty-btn {
  padding: 16rpx 48rpx;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-sm);
}
</style>
