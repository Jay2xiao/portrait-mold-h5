<script setup lang="ts">
import { getStarArray } from '@/utils/format'

const props = withDefaults(defineProps<{
  value: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  readonly: true,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const stars = getStarArray(props.value)

const sizeMap = { sm: '12px', md: '16px', lg: '22px' }
const iconSize = sizeMap[props.size]

function handleClick(index: number) {
  if (props.readonly) return
  emit('change', index + 1)
}
</script>

<template>
  <view class="star-rating" :class="{ interactive: !readonly }">
    <view
      v-for="(star, index) in stars"
      :key="index"
      class="star-item"
      @tap="handleClick(index)"
    >
      <!-- #ifdef H5 -->
      <svg
        :viewBox="'0 0 24 24'"
        :width="iconSize"
        :height="iconSize"
        :fill="star === 'full' ? '#FDCB6E' : star === 'half' ? '#FDCB6E' : '#E0E0E0'"
      >
        <path v-if="star === 'full'" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        <path v-else-if="star === 'half'" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
        <path v-else d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
      </svg>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <text class="star-text" :style="{ fontSize: iconSize, color: star === 'empty' ? '#E0E0E0' : '#FDCB6E' }">
        {{ star === 'empty' ? '☆' : '★' }}
      </text>
      <!-- #endif -->
    </view>
    <text v-if="!readonly" class="star-value">{{ value }}</text>
  </view>
</template>

<style lang="scss" scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.star-item {
  display: inline-flex;
  align-items: center;
}
.interactive .star-item {
  padding: 4rpx;
}
.star-text {
  line-height: 1;
}
.star-value {
  margin-left: 8rpx;
  font-size: var(--font-sm);
  color: var(--color-warning);
  font-weight: 600;
}
</style>
