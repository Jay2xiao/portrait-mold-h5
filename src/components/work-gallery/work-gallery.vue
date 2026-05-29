<script setup lang="ts">
import type { Work } from '@/types/modeler'

const props = withDefaults(defineProps<{
  works: Work[]
  title?: string
  mode?: 'scroll' | 'grid'
}>(), {
  title: '作品展示',
  mode: 'scroll'
})

const emit = defineEmits<{
  (e: 'preview', index: number): void
}>()

function handleTap(index: number) {
  emit('preview', index)
}
</script>

<template>
  <view class="work-gallery">
    <view class="gallery-header">
      <text class="gallery-title">{{ title }}</text>
      <text class="gallery-count">共{{ works.length }}个作品</text>
    </view>

    <!-- 横向滚动模式 -->
    <scroll-view v-if="mode === 'scroll'" scroll-x class="works-scroll">
      <view class="works-row">
        <view
          v-for="(work, index) in works"
          :key="work.id"
          class="work-item"
          @tap="handleTap(index)"
        >
          <image class="work-image" :src="work.imageUrl" mode="aspectFill" lazy-load />
          <view class="work-info">
            <text class="work-title text-ellipsis">{{ work.title }}</text>
            <text class="work-type">{{ work.type }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 网格模式 -->
    <view v-else class="works-grid">
      <view
        v-for="(work, index) in works"
        :key="work.id"
        class="grid-item"
        @tap="handleTap(index)"
      >
        <image class="grid-image" :src="work.imageUrl" mode="aspectFill" lazy-load />
        <view class="grid-info">
          <text class="work-title text-ellipsis">{{ work.title }}</text>
          <text class="work-type">{{ work.type }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
.gallery-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
}
.gallery-count {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.works-scroll {
  white-space: nowrap;
}
.works-row {
  display: inline-flex;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
}
.work-item {
  width: 280rpx;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-page);
  @include press-feedback;
}
.work-image {
  width: 280rpx;
  height: 280rpx;
}
.work-info {
  padding: 12rpx 16rpx;
}
.work-title {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 4rpx;
}
.work-type {
  font-size: var(--font-xs);
  color: var(--color-primary);
}

/* 网格模式 */
.works-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
.grid-item {
  width: calc(50% - 12rpx);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-page);
  @include press-feedback;
}
.grid-image {
  width: 100%;
  height: 320rpx;
}
.grid-info {
  padding: 12rpx 16rpx;
}
</style>
