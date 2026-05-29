<script setup lang="ts">
import type { Modeler } from '@/types/modeler'
import { useFavoriteStore } from '@/stores/favorite'
import { requireLogin } from '@/utils/auth'

const props = defineProps<{ modeler: Modeler }>()
const emit = defineEmits<{ (e: 'select', id: number): void }>()

const favoriteStore = useFavoriteStore()
const isCollected = () => favoriteStore.isFavorite(props.modeler.id)

function onToggleFavorite() {
  if (!requireLogin()) return
  favoriteStore.toggleFavorite(props.modeler.id)
}
</script>

<template>
  <view class="modeler-card" @tap="emit('select', modeler.id)">
    <view class="card-header">
      <view class="avatar-wrap">
        <image class="avatar" :src="modeler.avatar" mode="aspectFill" />
        <view class="online-dot" :class="{ offline: !modeler.isOnline }" />
      </view>
      <view class="info">
        <view class="name-row">
          <text class="name">{{ modeler.name }}</text>
          <text class="title-tag">{{ modeler.title }}</text>
        </view>
        <view class="stats-row">
          <mc-star-rating :value="modeler.rating" size="sm" />
          <text class="rating-num">{{ modeler.rating }}</text>
          <text class="divider-dot">|</text>
          <text class="order-count">{{ modeler.orderCount }}单</text>
        </view>
      </view>
      <!-- 收藏按钮 -->
      <view class="fav-btn" @tap.stop="onToggleFavorite">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="18px" height="18px"
          :fill="isCollected() ? '#E17055' : '#B2BEC3'">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <!-- #endif -->
      </view>
    </view>
    <view class="tags-row">
      <text v-for="tag in modeler.tags" :key="tag" class="tag">{{ tag }}</text>
    </view>
    <view class="card-footer">
      <view class="price-info">
        <text class="price-label">参考</text>
        <text class="price-value">¥{{ modeler.priceRange }}</text>
      </view>
      <view class="delivery-info">
        <text class="delivery-text">交付 {{ modeler.deliveryDays }}天</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.modeler-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: 0 var(--spacing-lg) var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
.fav-btn {
  flex-shrink: 0;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-bg-page);
  margin-left: var(--spacing-sm);
  transition: transform 0.2s;

  &:active {
    transform: scale(1.2);
  }
}
.avatar-wrap {
  position: relative;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: 3rpx solid var(--color-border-light);
}
.online-dot {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: var(--color-success);
  border: 3rpx solid var(--color-bg-card);

  &.offline {
    background-color: #B2BEC3;
  }
}
.info {
  flex: 1;
  overflow: hidden;
}
.name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}
.name {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-right: 12rpx;
}
.title-tag {
  font-size: var(--font-xs);
  color: var(--color-primary);
  background: var(--color-primary-bg);
  padding: 4rpx 12rpx;
  border-radius: var(--radius-full);
}
.stats-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.rating-num {
  font-size: var(--font-sm);
  color: var(--color-warning);
  font-weight: 600;
}
.divider-dot {
  color: var(--color-text-placeholder);
  font-size: var(--font-xs);
}
.order-count {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: var(--spacing-md);
}
.tag {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-page);
  padding: 6rpx 16rpx;
  border-radius: var(--radius-full);
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1rpx solid var(--color-border-light);
}
.price-info {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}
.price-label {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
}
.price-value {
  font-size: var(--font-lg);
  color: var(--color-danger);
  font-weight: 600;
}
.delivery-info {
  background: rgba(0, 184, 148, 0.1);
  padding: 6rpx 16rpx;
  border-radius: var(--radius-full);
}
.delivery-text {
  font-size: var(--font-xs);
  color: var(--color-success);
}
</style>
