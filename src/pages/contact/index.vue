<script setup lang="ts">
import { contactModeler, CUSTOMER_SERVICE_QRCODE_URL, CUSTOMER_SERVICE_WECHAT_ID } from '@/utils/contact'

function handleCopy() {
  if (!CUSTOMER_SERVICE_WECHAT_ID) {
    uni.showToast({ title: '客服微信号暂未配置', icon: 'none' })
    return
  }
  uni.setClipboardData({
    data: CUSTOMER_SERVICE_WECHAT_ID,
    success: () => {
      uni.showToast({ title: '微信号已复制', icon: 'none' })
    }
  })
}

function handleContact() {
  contactModeler()
}
</script>

<template>
  <view class="page-container contact-page">
    <view class="contact-card">
      <view class="contact-icon">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="32px" height="32px" fill="#6C5CE7">
          <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.96 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z"/>
        </svg>
        <!-- #endif -->
      </view>
      <text class="contact-title">联系我们</text>
      <text class="contact-desc">如有任何问题，欢迎联系客服团队</text>

      <view v-if="CUSTOMER_SERVICE_QRCODE_URL" class="qrcode-section">
        <image class="qrcode-img" :src="CUSTOMER_SERVICE_QRCODE_URL" mode="aspectFit" />
        <text class="qrcode-tip">长按识别二维码添加客服</text>
      </view>

      <view class="action-list">
        <view class="action-item" @tap="handleCopy">
          <text class="action-text">复制客服微信号</text>
          <text class="action-tip">{{ CUSTOMER_SERVICE_WECHAT_ID || '暂未配置' }}</text>
        </view>
        <view class="action-item primary" @tap="handleContact">
          <text class="action-text">直接咨询</text>
        </view>
      </view>

      <text class="service-time">服务时间：周一至周日 9:00-21:00</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.contact-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-lg);
}
.contact-card {
  width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contact-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: var(--color-primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.contact-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}
.contact-desc {
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  margin-top: 8rpx;
  margin-bottom: var(--spacing-xl);
}
.qrcode-section {
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qrcode-img {
  width: 360rpx;
  height: 360rpx;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
}
.qrcode-tip {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
.action-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx var(--spacing-lg);
  border-radius: var(--radius-lg);
  background: var(--color-bg-page);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }

  &.primary {
    background: var(--gradient-wechat);
    justify-content: center;
  }
  &.primary .action-text {
    color: var(--color-text-white);
    font-weight: 600;
  }
}
.action-text {
  font-size: var(--font-md);
  color: var(--color-text-primary);
}
.action-tip {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
.service-time {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  margin-top: var(--spacing-xl);
}
</style>
