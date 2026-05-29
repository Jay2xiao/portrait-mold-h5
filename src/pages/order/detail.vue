<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { OrderDetail } from '@/types/order'
import { getOrderDetail } from '@/api/order'
import { formatPrice, formatDate } from '@/utils/format'

const orderId = ref(0)
const detail = ref<OrderDetail | null>(null)
const loading = ref(true)

onLoad((options) => {
  if (options?.id) {
    orderId.value = parseInt(options.id)
    loadDetail()
  }
})

async function loadDetail() {
  try {
    detail.value = await getOrderDetail(orderId.value)
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onContact() {
  uni.navigateTo({ url: '/pages/contact/index' })
}

function onReview() {
  if (detail.value?.businessStatus === 'COMPLETED') {
    uni.navigateTo({ url: `/pages/review/create?orderId=${orderId.value}` })
  }
}
</script>

<template>
  <view class="page-container">
    <mc-skeleton-detail v-if="loading" />

    <template v-else-if="detail">
      <!-- 状态头部 -->
      <view class="status-header">
        <text class="status-label">{{
          detail.businessStatus === 'PENDING' ? '待确认' :
          detail.businessStatus === 'REPAIRING' ? '修模中' :
          detail.businessStatus === 'REVIEWING' ? '待验收' :
          detail.businessStatus === 'COMPLETED' ? '已完成' : '已取消'
        }}</text>
        <text class="status-desc">{{
          detail.businessStatus === 'PENDING' ? '等待建模师确认订单' :
          detail.businessStatus === 'REPAIRING' ? '建模师正在精心修模' :
          detail.businessStatus === 'REVIEWING' ? '请验收修模效果' :
          detail.businessStatus === 'COMPLETED' ? '感谢您的信任' : '订单已取消'
        }}</text>
      </view>

      <!-- 产品信息 -->
      <view class="info-card">
        <view class="product-row">
          <image class="product-img" :src="detail.productImageUrl" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ detail.productName }}</text>
            <text class="product-type">{{ detail.productType }}</text>
            <text class="product-price">¥{{ formatPrice(detail.saleAmountTotal) }}</text>
          </view>
        </view>
      </view>

      <!-- 建模师信息 -->
      <view class="info-card">
        <text class="card-title">建模师</text>
        <view class="modeler-row">
          <image class="modeler-avatar" :src="detail.modelerAvatar" mode="aspectFill" />
          <text class="modeler-name">{{ detail.modelerName }}</text>
        </view>
      </view>

      <!-- 收货信息 -->
      <view class="info-card">
        <text class="card-title">收货信息</text>
        <view class="address-info">
          <text class="addr-name">{{ detail.receiverNameSnapshot }} {{ detail.receiverPhoneSnapshot }}</text>
          <text class="addr-detail">{{ detail.receiverAddressSnapshot }}</text>
        </view>
      </view>

      <!-- 状态时间线 -->
      <view class="info-card">
        <text class="card-title">订单进度</text>
        <view class="timeline">
          <view v-for="(item, index) in detail.timeline" :key="index" class="timeline-item" :class="{ first: index === 0 }">
            <view class="timeline-dot" />
            <view v-if="index < detail.timeline.length - 1" class="timeline-line" />
            <view class="timeline-content">
              <text class="timeline-action">{{ item.action }}</text>
              <text v-if="item.remark" class="timeline-remark">{{ item.remark }}</text>
              <text class="timeline-time">{{ formatDate(item.time) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="info-card">
        <text class="card-title">订单信息</text>
        <view class="detail-row">
          <text class="detail-label">订单编号</text>
          <text class="detail-value">{{ detail.orderNo }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">下单时间</text>
          <text class="detail-value">{{ formatDate(detail.createTime) }}</text>
        </view>
        <view v-if="detail.remark" class="detail-row">
          <text class="detail-label">备注</text>
          <text class="detail-value">{{ detail.remark }}</text>
        </view>
      </view>

      <!-- 底部操作 -->
      <view class="bottom-placeholder" />
      <view class="bottom-bar safe-area-bottom">
        <view class="bar-btn btn-secondary" @tap="onContact">
          <text>联系客服</text>
        </view>
        <view
          v-if="detail.businessStatus === 'COMPLETED'"
          class="bar-btn btn-primary"
          @tap="onReview"
        >
          <text>发表评价</text>
        </view>
      </view>
    </template>

    <mc-empty-state v-else text="订单不存在" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.status-header {
  background: var(--gradient-primary);
  padding: 60rpx var(--spacing-lg) 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.status-label {
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--color-text-white);
}
.status-desc {
  font-size: var(--font-base);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.info-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.card-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}
.product-row {
  display: flex;
  gap: var(--spacing-md);
}
.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-name {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--color-text-primary);
}
.product-type {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.product-price {
  font-size: var(--font-lg);
  color: var(--color-danger);
  font-weight: 600;
}

.modeler-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.modeler-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
.modeler-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
}

.addr-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}
.addr-detail {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

/* 时间线 */
.timeline {
  position: relative;
}
.timeline-item {
  display: flex;
  position: relative;
  padding-left: 40rpx;
  padding-bottom: var(--spacing-lg);

  &.first .timeline-dot {
    background: var(--color-primary);
  }
  &.first .timeline-action {
    color: var(--color-primary);
    font-weight: 600;
  }
}
.timeline-dot {
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: var(--color-border);
  z-index: 1;
}
.timeline-line {
  position: absolute;
  left: 7rpx;
  top: 28rpx;
  width: 2rpx;
  bottom: 0;
  background: var(--color-border-light);
}
.timeline-content {
  flex: 1;
}
.timeline-action {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  display: block;
}
.timeline-remark {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  display: block;
  margin-top: 4rpx;
}
.timeline-time {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  display: block;
  margin-top: 4rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid var(--color-border-light);
  &:last-child { border-bottom: none; }
}
.detail-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.detail-value {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  text-align: right;
  max-width: 60%;
}

.bottom-placeholder { height: 140rpx; }
.bottom-bar {
  @include fixed-bottom;
  display: flex;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
}
.bar-btn {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: var(--radius-full);
  font-size: var(--font-md);
  font-weight: 600;
  @include press-feedback;
}
.btn-secondary {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}
.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-white);
}
</style>
