<script setup lang="ts">
import type { Modeler } from '@/types/modeler'
import { contactModeler, CUSTOMER_SERVICE_QRCODE_URL, CUSTOMER_SERVICE_WECHAT_ID } from '@/utils/contact'

defineProps<{
  show: boolean
  modeler?: Modeler | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleContact() {
  contactModeler()
}

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
</script>

<template>
  <view v-if="show" class="sheet-overlay" @tap="emit('close')">
    <view class="contact-sheet" @tap.stop>
      <!-- 顶部拖动条 -->
      <view class="sheet-handle">
        <view class="handle-bar" />
      </view>

      <!-- 修模师信息 -->
      <view v-if="modeler" class="modeler-brief">
        <image class="brief-avatar" :src="modeler.avatar" mode="aspectFill" />
        <view class="brief-info">
          <text class="brief-name">{{ modeler.name }}</text>
          <text class="brief-title">{{ modeler.title }}</text>
        </view>
      </view>
      <view v-else class="modeler-brief">
        <view class="brief-avatar-placeholder" />
        <view class="brief-info">
          <text class="brief-name">联系客服</text>
          <text class="brief-title">专业客服团队为您服务</text>
        </view>
      </view>

      <!-- 二维码 -->
      <view v-if="CUSTOMER_SERVICE_QRCODE_URL" class="qrcode-section">
        <image class="qrcode-img" :src="CUSTOMER_SERVICE_QRCODE_URL" mode="aspectFit" />
        <text class="qrcode-tip">长按识别二维码添加客服</text>
      </view>

      <!-- 操作按钮 -->
      <view class="sheet-actions">
        <view class="action-btn btn-copy" @tap="handleCopy">
          <text>复制客服微信号</text>
        </view>
        <view class="action-btn btn-contact" @tap="handleContact">
          <text>直接咨询</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-bg-mask);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}
.contact-sheet {
  width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-lg);
  @include safe-area-bottom;
}
.sheet-handle {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}
.handle-bar {
  width: 64rpx;
  height: 8rpx;
  border-radius: var(--radius-full);
  background: var(--color-border);
}
.modeler-brief {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  margin-bottom: var(--spacing-lg);
}
.brief-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: var(--spacing-md);
}
.brief-avatar-placeholder {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: var(--color-primary-bg);
  margin-right: var(--spacing-md);
}
.brief-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
}
.brief-title {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}
.qrcode-img {
  width: 320rpx;
  height: 320rpx;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
}
.qrcode-tip {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.action-btn {
  text-align: center;
  padding: 28rpx 0;
  border-radius: var(--radius-full);
  font-size: var(--font-md);
  font-weight: 600;
  @include press-feedback;
}
.btn-copy {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}
.btn-contact {
  background: var(--gradient-wechat);
  color: var(--color-text-white);
}
</style>
