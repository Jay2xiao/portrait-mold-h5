<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import type { Order, OrderStatus } from '@/types/order'
import { getOrderList } from '@/api/order'
import { usePagination } from '@/composables/usePagination'
import { requireLogin } from '@/utils/auth'
import { formatDate, formatPrice } from '@/utils/format'

const tabs = [
  { value: 'ALL', label: '全部' },
  { value: 'PENDING', label: '待确认' },
  { value: 'REPAIRING', label: '进行中' },
  { value: 'COMPLETED', label: '已完成' }
]
const currentTab = ref('ALL')

const pagination = usePagination<Order>({
  fetchFn: (params) => getOrderList({ ...params, status: currentTab.value }),
  immediate: false
})

// 初始化加载
if (requireLogin()) {
  pagination.refresh()
}

onPullDownRefresh(async () => {
  await pagination.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagination.loadMore()
})

function onTabChange(tab: string) {
  currentTab.value = tab
  pagination.refresh()
}

function onOrderTap(id: number) {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}
</script>

<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <view class="order-nav">
      <text class="nav-title">我的订单</text>
    </view>

    <!-- Tab 切换 -->
    <view class="tabs-row">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @tap="onTabChange(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="currentTab === tab.value" class="tab-indicator" />
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <mc-skeleton-card v-if="pagination.loading.value && !pagination.list.value.length" :count="3" />

      <template v-else-if="pagination.list.value.length">
        <view v-for="order in pagination.list.value" :key="order.id" class="order-card" @tap="onOrderTap(order.id)">
          <view class="order-top">
            <text class="order-no">{{ order.orderNo }}</text>
            <mc-order-status-tag :status="order.businessStatus" />
          </view>
          <view class="order-body">
            <image class="order-img" :src="order.productImageUrl" mode="aspectFill" />
            <view class="order-info">
              <text class="order-name text-ellipsis">{{ order.productName }}</text>
              <text class="order-type">{{ order.productType }}</text>
              <view class="order-meta">
                <text class="order-modeler">{{ order.modelerName }}</text>
                <text class="order-price">¥{{ formatPrice(order.saleAmountTotal) }}</text>
              </view>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-time">{{ formatDate(order.createTime) }}</text>
          </view>
        </view>
      </template>

      <mc-empty-state v-else-if="!pagination.loading.value" type="order" text="暂无相关订单" />

      <mc-load-more
        v-if="pagination.list.value.length"
        :status="pagination.loadingMore.value ? 'loading' : pagination.noMore.value ? 'no-more' : 'idle'"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.order-nav {
  background: var(--gradient-primary);
  padding: 40rpx var(--spacing-lg) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-white);
}

.tabs-row {
  display: flex;
  background: var(--color-bg-card);
  padding: 0 var(--spacing-md);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: var(--spacing-lg) 0 var(--spacing-md);
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  position: relative;
  transition: all var(--transition-fast);

  &.active {
    color: var(--color-primary);
    font-weight: 600;
  }
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 6rpx;
  border-radius: var(--radius-full);
  background: var(--color-primary);
}

.order-list {
  padding-bottom: 120rpx;
}
.order-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  @include press-feedback;
}
.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
.order-no {
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
.order-body {
  display: flex;
  gap: var(--spacing-md);
}
.order-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.order-name {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  font-weight: 500;
}
.order-type {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.order-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-modeler {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.order-price {
  font-size: var(--font-lg);
  color: var(--color-danger);
  font-weight: 600;
}
.order-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1rpx solid var(--color-border-light);
}
.order-time {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
}
</style>
