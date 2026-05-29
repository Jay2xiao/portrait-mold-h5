<script setup lang="ts">
import type { PriceItem } from '@/types/modeler'

defineProps<{ priceList: PriceItem[] }>()
</script>

<template>
  <view class="price-table">
    <view class="table-header">
      <text class="col-service">服务项目</text>
      <text class="col-price">价格</text>
      <text class="col-days">交付周期</text>
    </view>
    <view v-for="item in priceList" :key="item.id" class="table-row">
      <view class="col-service">
        <text class="service-name">{{ item.serviceName }}</text>
        <text v-if="item.description" class="service-desc">{{ item.description }}</text>
      </view>
      <text class="col-price price-text">¥{{ item.price }}</text>
      <view class="col-days">
        <text class="days-tag">{{ item.deliveryDays }}天</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.price-table {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.table-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-page);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: 600;
}
.table-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1rpx solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
}
.col-service {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.col-price {
  width: 160rpx;
  text-align: center;
}
.col-days {
  width: 140rpx;
  text-align: center;
}
.service-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
}
.service-desc {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  margin-top: 4rpx;
}
.price-text {
  font-size: var(--font-md);
  color: var(--color-danger);
  font-weight: 600;
}
.days-tag {
  display: inline-block;
  font-size: var(--font-xs);
  color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  padding: 4rpx 16rpx;
  border-radius: var(--radius-full);
}
</style>
