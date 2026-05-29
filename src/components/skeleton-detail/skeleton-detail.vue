<template>
  <view class="skeleton-detail">
    <!-- 头部占位 -->
    <view class="skeleton-hero">
      <view class="skeleton-avatar shimmer" />
      <view class="skeleton-line w40 shimmer" />
      <view class="skeleton-line w60 shimmer" />
      <view class="skeleton-line w30 shimmer" />
    </view>
    <!-- 标签 -->
    <view class="skeleton-section">
      <view class="skeleton-tags">
        <view v-for="i in 4" :key="i" class="skeleton-tag shimmer" />
      </view>
    </view>
    <!-- 简介 -->
    <view class="skeleton-section">
      <view class="skeleton-line w80 shimmer" />
      <view class="skeleton-line w90 shimmer" />
      <view class="skeleton-line w60 shimmer" />
    </view>
    <!-- 作品 -->
    <view class="skeleton-section">
      <view class="skeleton-works">
        <view v-for="i in 3" :key="i" class="skeleton-work shimmer" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.skeleton-hero {
  background: var(--gradient-header);
  padding: 60rpx 40rpx;
  border-radius: 0 0 40% 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.skeleton-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-bottom: var(--spacing-md);
  background: rgba(255,255,255,0.2);
  animation: shimmer 1.5s infinite;
}
.skeleton-hero .skeleton-line {
  background: rgba(255,255,255,0.2);
  height: 28rpx;
  border-radius: var(--radius-xs);
  margin-bottom: 12rpx;
  animation: shimmer 1.5s infinite;
}
.skeleton-section {
  padding: var(--spacing-lg);
}
.skeleton-line {
  height: 28rpx;
  border-radius: var(--radius-xs);
  margin-bottom: 16rpx;
  @include skeleton-shimmer;
}
.w90 { width: 90%; }
.w80 { width: 80%; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w30 { width: 30%; }
.skeleton-tags {
  display: flex;
  gap: 12rpx;
}
.skeleton-tag {
  width: 140rpx;
  height: 48rpx;
  border-radius: var(--radius-full);
  @include skeleton-shimmer;
}
.skeleton-works {
  display: flex;
  gap: 16rpx;
}
.skeleton-work {
  width: 200rpx;
  height: 200rpx;
  border-radius: var(--radius-md);
  @include skeleton-shimmer;
}
</style>
