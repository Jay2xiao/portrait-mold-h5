<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import type { Modeler } from '@/types/modeler'
import { getModelerList } from '@/api/modeler'
import { usePagination } from '@/composables/usePagination'
import { useModelerStore } from '@/stores/modeler'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const modelerStore = useModelerStore()

const searchKeyword = ref(modelerStore.lastSearchKeyword)
const currentTag = ref(modelerStore.lastFilterTag || '全部')
const currentSort = ref('default')

const categories = modelerStore.categoryList
const sortOptions = [
  { value: 'default', label: '综合' },
  { value: 'rating', label: '评分最高' },
  { value: 'orders', label: '订单最多' },
  { value: 'price-low', label: '价格最低' }
]

const pagination = usePagination<Modeler>({
  fetchFn: async (params) => {
    return getModelerList({
      ...params,
      tag: currentTag.value === '全部' ? '' : currentTag.value,
      sort: currentSort.value,
      keyword: searchKeyword.value
    })
  },
  immediate: false
})

onMounted(() => {
  pagination.refresh()
})

onPullDownRefresh(async () => {
  await pagination.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagination.loadMore()
})

function onSearch(val: string) {
  searchKeyword.value = val
  modelerStore.setSearchState(val, currentTag.value)
  pagination.refresh()
}

function onClearSearch() {
  searchKeyword.value = ''
  modelerStore.clearSearchState()
  pagination.refresh()
}

function onTagChange(tag: string) {
  currentTag.value = tag
  modelerStore.setSearchState(searchKeyword.value, tag)
  pagination.refresh()
}

function onSortChange(sort: string) {
  currentSort.value = sort
  pagination.refresh()
}

function onModelerTap(id: number) {
  uni.navigateTo({ url: `/pages/modeler/detail?id=${id}` })
}
</script>

<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <view class="nav-header" :style="{ paddingTop: appStore.statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">模匠工坊</text>
        <text class="nav-subtitle">专业3D建模 · 修模服务</text>
      </view>
      <view class="nav-arc" />
    </view>

    <!-- 搜索栏 -->
    <view class="search-section">
      <mc-search-bar
        :model-value="searchKeyword"
        @search="onSearch"
        @clear="onClearSearch"
      />
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="tags-scroll">
      <view class="tags-row">
        <view
          v-for="cat in categories"
          :key="cat"
          class="tag-item"
          :class="{ active: currentTag === cat }"
          @tap="onTagChange(cat)"
        >
          <text>{{ cat }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 排序选项 -->
    <view class="sort-row">
      <view
        v-for="opt in sortOptions"
        :key="opt.value"
        class="sort-item"
        :class="{ active: currentSort === opt.value }"
        @tap="onSortChange(opt.value)"
      >
        <text>{{ opt.label }}</text>
      </view>
    </view>

    <!-- 列表内容 -->
    <view class="list-section">
      <!-- 骨架屏 -->
      <mc-skeleton-card v-if="pagination.loading.value && !pagination.list.value.length" :count="3" />

      <!-- 建模师卡片列表 -->
      <template v-else-if="pagination.list.value.length">
        <mc-modeler-card
          v-for="modeler in pagination.list.value"
          :key="modeler.id"
          :modeler="modeler"
          @select="onModelerTap"
        />
      </template>

      <!-- 空状态 -->
      <mc-empty-state
        v-else-if="!pagination.loading.value"
        type="search"
        text="没有找到符合条件的建模师"
      />

      <!-- 加载更多 -->
      <mc-load-more
        v-if="pagination.list.value.length"
        :status="pagination.loadingMore.value ? 'loading' : pagination.noMore.value ? 'no-more' : 'idle'"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.nav-header {
  @include arc-header(280rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 40rpx;
}
.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.nav-title {
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--color-text-white);
  letter-spacing: 4rpx;
}
.nav-subtitle {
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}
.nav-arc {
  position: absolute;
  bottom: -2rpx;
  left: 0;
  right: 0;
  height: 40rpx;
  background: var(--color-bg-page);
  border-radius: 50% 50% 0 0;
}

.search-section {
  margin-top: -30rpx;
  position: relative;
  z-index: 2;
  margin-bottom: var(--spacing-sm);
}

.tags-scroll {
  white-space: nowrap;
  padding: var(--spacing-sm) 0;
}
.tags-row {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 var(--spacing-lg);
}
.tag-item {
  padding: 12rpx 28rpx;
  border-radius: var(--radius-full);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: var(--font-sm);
  flex-shrink: 0;
  transition: all var(--transition-fast);

  &.active {
    background: var(--gradient-primary);
    color: var(--color-text-white);
    font-weight: 500;
  }
}

.sort-row {
  display: flex;
  padding: var(--spacing-sm) var(--spacing-lg);
  gap: var(--spacing-lg);
}
.sort-item {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  padding-bottom: 8rpx;
  border-bottom: 4rpx solid transparent;
  transition: all var(--transition-fast);

  &.active {
    color: var(--color-primary);
    font-weight: 600;
    border-bottom-color: var(--color-primary);
  }
}

.list-section {
  padding-bottom: 120rpx;
}
</style>
