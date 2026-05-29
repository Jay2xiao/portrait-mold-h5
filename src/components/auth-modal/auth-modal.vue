<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
  content?: string
}>()

const emit = defineEmits<{
  (e: 'login'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <view v-if="show" class="auth-overlay" @tap="emit('cancel')">
    <view class="auth-modal" @tap.stop>
      <view class="auth-icon">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="30px" height="30px" fill="#6C5CE7">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <!-- #endif -->
      </view>
      <text class="auth-title">{{ title || '需要登录' }}</text>
      <text class="auth-content">{{ content || '请先登录后再进行此操作' }}</text>
      <view class="auth-buttons">
        <view class="btn-cancel" @tap="emit('cancel')">
          <text>暂不登录</text>
        </view>
        <view class="btn-login" @tap="emit('login')">
          <text>立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-bg-mask);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.auth-modal {
  width: 580rpx;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: var(--color-primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.auth-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}
.auth-content {
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}
.auth-buttons {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
}
.btn-cancel {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: var(--radius-full);
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  font-size: var(--font-md);
}
.btn-login {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-md);
  font-weight: 600;
}
</style>
