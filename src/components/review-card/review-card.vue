<script setup lang="ts">
import type { Review } from '@/types/review'
import { formatDate } from '@/utils/format'

defineProps<{ review: Review }>()
</script>

<template>
  <view class="review-card">
    <view class="review-header">
      <image class="reviewer-avatar" :src="review.modelerAvatar || '/static/avatar-default.png'" mode="aspectFill" />
      <view class="reviewer-info">
        <text class="reviewer-name">{{ (review as any)._userName || review.modelerName }}</text>
        <mc-star-rating :value="review.rating" size="sm" />
      </view>
      <text class="review-time">{{ formatDate(review.createTime, 'YYYY-MM-DD') }}</text>
    </view>
    <text class="review-content">{{ review.content }}</text>
    <view v-if="review.images?.length" class="review-images">
      <image
        v-for="(img, idx) in review.images"
        :key="idx"
        class="review-image"
        :src="img"
        mode="aspectFill"
      />
    </view>
    <view v-if="review.replyContent" class="reply-section">
      <text class="reply-label">建模师回复：</text>
      <text class="reply-content">{{ review.replyContent }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.review-card {
  padding: var(--spacing-lg);
  border-bottom: 1rpx solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
}
.review-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}
.reviewer-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  flex-shrink: 0;
}
.reviewer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.reviewer-name {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  font-weight: 500;
}
.review-time {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
}
.review-content {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
}
.review-images {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-sm);
}
.review-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-sm);
}
.reply-section {
  background: var(--color-bg-page);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}
.reply-label {
  font-size: var(--font-sm);
  color: var(--color-primary);
  font-weight: 500;
}
.reply-content {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
</style>
