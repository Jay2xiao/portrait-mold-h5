<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorite'
import type { FavoriteModeler } from '@/types/favorite'
import { getFavoriteList } from '@/api/favorite'
import { usePagination } from '@/composables/usePagination'
import { requireLogin } from '@/utils/auth'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const favoriteStore = useFavoriteStore()

const pagination = usePagination<FavoriteModeler>({
  fetchFn: (params) => getFavoriteList(params),
  immediate: false
})

if (requireLogin()) {
  favoriteStore.loadFavoriteIds()
  pagination.refresh()
}

onPullDownRefresh(async () => {
  await pagination.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagination.loadMore()
})

function onModelerTap(id: number) {
  uni.navigateTo({ url: `/pages/modeler/detail?id=${id}` })
}

function onGoHome() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="page-container">
    <view class="favorite-list">
      <!-- 骨架屏 -->
      <mc-skeleton-card v-if="pagination.loading.value && !pagination.list.value.length" :count="3" />

      <!-- 收藏列表 -->
      <template v-else-if="pagination.list.value.length">
        <mc-modeler-card
          v-for="item in pagination.list.value"
          :key="item.id"
          :modeler="item"
          @select="onModelerTap"
        />
      </template>

      <!-- 空状态 -->
      <mc-empty-state
        v-else-if="!pagination.loading.value"
        type="favorite"
        text="还没有收藏的建模师"
        btn-text="去首页看看"
        @action="onGoHome"
      />

      <mc-load-more
        v-if="pagination.list.value.length"
        :status="pagination.loadingMore.value ? 'loading' : pagination.noMore.value ? 'no-more' : 'idle'"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.favorite-list {
  padding-top: var(--spacing-md);
  padding-bottom: 40rpx;
}
</style>
