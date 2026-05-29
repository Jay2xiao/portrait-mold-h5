<script setup lang="ts">
import type { OrderStatus, OrderStatusConfig } from '@/types/order'

defineProps<{ status: OrderStatus }>()

const statusMap: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: { label: '待确认', color: '#FDCB6E', bgColor: 'rgba(253,203,110,0.15)' },
  REPAIRING: { label: '修模中', color: '#6C5CE7', bgColor: 'rgba(108,92,231,0.1)' },
  REVIEWING: { label: '待验收', color: '#74B9FF', bgColor: 'rgba(116,185,255,0.15)' },
  COMPLETED: { label: '已完成', color: '#00B894', bgColor: 'rgba(0,184,148,0.1)' },
  CANCELLED: { label: '已取消', color: '#B2BEC3', bgColor: 'rgba(178,190,195,0.15)' }
}
</script>

<template>
  <view
    class="order-status-tag"
    :style="{
      color: statusMap[status]?.color,
      backgroundColor: statusMap[status]?.bgColor
    }"
  >
    <text>{{ statusMap[status]?.label || status }}</text>
  </view>
</template>

<style lang="scss" scoped>
.order-status-tag {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 20rpx;
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: 500;
}
</style>
