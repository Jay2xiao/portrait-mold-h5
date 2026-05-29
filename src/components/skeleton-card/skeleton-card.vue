<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 3 })
</script>

<template>
  <view class="skeleton-list">
    <view v-for="i in count" :key="i" class="skeleton-card">
      <view class="skeleton-header">
        <view class="skeleton-avatar shimmer" />
        <view class="skeleton-info">
          <view class="skeleton-line w60 shimmer" />
          <view class="skeleton-line w40 shimmer" />
        </view>
      </view>
      <view class="skeleton-tags">
        <view class="skeleton-tag shimmer" />
        <view class="skeleton-tag shimmer" />
        <view class="skeleton-tag shimmer" />
      </view>
      <view class="skeleton-line w80 shimmer" />
      <view class="skeleton-footer">
        <view class="skeleton-line w30 shimmer" />
        <view class="skeleton-line w20 shimmer" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.skeleton-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
.skeleton-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  margin-right: var(--spacing-md);
  @include skeleton-shimmer;
}
.skeleton-info {
  flex: 1;
}
.skeleton-line {
  height: 28rpx;
  border-radius: var(--radius-xs);
  margin-bottom: 12rpx;
  @include skeleton-shimmer;
}
.w80 { width: 80%; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w30 { width: 30%; }
.w20 { width: 20%; }
.skeleton-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: var(--spacing-md);
}
.skeleton-tag {
  width: 120rpx;
  height: 40rpx;
  border-radius: var(--radius-full);
  @include skeleton-shimmer;
}
.skeleton-footer {
  display: flex;
  justify-content: space-between;
}
</style>
