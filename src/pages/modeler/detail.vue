<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import type { ModelerDetail } from '@/types/modeler'
import { getModelerDetail } from '@/api/modeler'
import { useImagePreview } from '@/composables/useImagePreview'
import { useFavoriteStore } from '@/stores/favorite'
import { contactModeler } from '@/utils/contact'
import { requireLogin } from '@/utils/auth'

const { preview } = useImagePreview()
const favoriteStore = useFavoriteStore()

const modelerId = ref(0)
const detail = ref<ModelerDetail | null>(null)
const loading = ref(true)
const showContactSheet = ref(false)

onLoad((options) => {
  if (options?.id) {
    modelerId.value = parseInt(options.id)
  }
  loadDetail()
})

onShareAppMessage(() => ({
  title: detail.value ? `${detail.value.name} - ${detail.value.title}` : '模匠工坊',
  path: `/pages/modeler/detail?id=${modelerId.value}`
}))

async function loadDetail() {
  if (!modelerId.value) {
    loading.value = false
    return
  }
  try {
    detail.value = await getModelerDetail(modelerId.value)
    favoriteStore.loadFavoriteIds()
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onWorkPreview(index: number) {
  if (!detail.value) return
  const urls = detail.value.works.map(w => w.imageUrl)
  preview(urls, index)
}

function onContact() {
  showContactSheet.value = true
}

function onShare() {
  // #ifdef MP-WEIXIN
  // 小程序分享由 onShareAppMessage 处理
  // #endif
  // #ifdef H5
  uni.showToast({ title: '请使用浏览器分享功能', icon: 'none' })
  // #endif
}

function onToggleFavorite() {
  if (!requireLogin()) return
  favoriteStore.toggleFavorite(modelerId.value)
}
</script>

<template>
  <view class="page-container">
    <!-- 骨架屏 -->
    <mc-skeleton-detail v-if="loading" />

    <!-- 详情内容 -->
    <template v-else-if="detail">
      <!-- 弧形头部 -->
      <view class="detail-header">
        <view class="header-content">
          <view class="avatar-wrap">
            <image class="avatar" :src="detail.avatar" mode="aspectFill" />
            <view class="online-dot" :class="{ offline: !detail.isOnline }" />
          </view>
          <text class="detail-name">{{ detail.name }}</text>
          <text class="detail-title">{{ detail.title }}</text>
          <view class="detail-stats">
            <mc-star-rating :value="detail.rating" size="sm" />
            <text class="stat-num">{{ detail.rating }}</text>
            <text class="stat-divider">|</text>
            <text class="stat-text">{{ detail.orderCount }}单</text>
            <text class="stat-divider">|</text>
            <text class="stat-text">{{ detail.experience }}年经验</text>
          </view>
        </view>
      </view>

      <!-- 技能标签 -->
      <view class="section-card tags-card">
        <view class="tags-list">
          <text v-for="tag in detail.tags" :key="tag" class="skill-tag">{{ tag }}</text>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="section-card">
        <text class="section-title">个人简介</text>
        <text class="description">{{ detail.description }}</text>
      </view>

      <!-- 作品展示 -->
      <view class="section-card">
        <mc-work-gallery
          :works="detail.works"
          mode="scroll"
          @preview="onWorkPreview"
        />
      </view>

      <!-- 服务价格 -->
      <view class="section-card">
        <text class="section-title">服务价格</text>
        <mc-price-table :price-list="detail.priceList" />
      </view>

      <!-- 用户评价 -->
      <view class="section-card">
        <view class="review-header">
          <text class="section-title">用户评价</text>
          <text class="review-total">共{{ detail.reviewStats.total }}条</text>
        </view>
        <view class="review-avg">
          <text class="avg-number">{{ detail.reviewStats.avgRating }}</text>
          <mc-star-rating :value="detail.reviewStats.avgRating" size="md" />
        </view>
        <mc-review-card
          v-for="review in detail.reviews"
          :key="review.id"
          :review="review"
        />
      </view>

      <!-- 底部占位 -->
      <view class="bottom-placeholder" />

      <!-- 固定底部操作栏 -->
      <view class="bottom-bar safe-area-bottom">
        <view class="bar-btn btn-share" @tap="onShare">
          <!-- #ifdef H5 -->
          <svg viewBox="0 0 24 24" width="20px" height="20px" fill="#636E72">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <!-- #endif -->
          <text>分享</text>
        </view>
        <view class="bar-btn btn-fav" @tap="onToggleFavorite">
          <!-- #ifdef H5 -->
          <svg viewBox="0 0 24 24" width="20px" height="20px"
            :fill="favoriteStore.isFavorite(modelerId) ? '#E17055' : '#636E72'">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <!-- #endif -->
          <text :class="{ 'fav-active': favoriteStore.isFavorite(modelerId) }">收藏</text>
        </view>
        <view class="bar-btn btn-contact" @tap="onContact">
          <text>联系修模师</text>
        </view>
      </view>

      <!-- 联系客服弹窗 -->
      <mc-contact-sheet
        :show="showContactSheet"
        :modeler="detail"
        @close="showContactSheet = false"
      />
    </template>

    <!-- 空状态 -->
    <mc-empty-state v-else text="建模师不存在" btn-text="返回首页" @action="uni.switchTab({ url: '/pages/index/index' })" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.detail-header {
  background: var(--gradient-header);
  padding: 80rpx 40rpx 80rpx;
  border-radius: 0 0 40% 40%;
  position: relative;
}
.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-wrap {
  position: relative;
  margin-bottom: var(--spacing-md);
}
.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
}
.online-dot {
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: var(--color-success);
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  &.offline { background: #B2BEC3; }
}
.detail-name {
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--color-text-white);
}
.detail-title {
  font-size: var(--font-base);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}
.detail-stats {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: var(--spacing-sm);
}
.stat-num {
  font-size: var(--font-sm);
  color: var(--color-warning);
  font-weight: 600;
}
.stat-divider {
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--font-xs);
}
.stat-text {
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.9);
}

.section-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.tags-card {
  margin-top: -30rpx;
  position: relative;
  z-index: 2;
}
.section-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.skill-tag {
  padding: 10rpx 24rpx;
  border-radius: var(--radius-full);
  background: var(--color-primary-bg);
  color: var(--color-primary);
  font-size: var(--font-sm);
}
.description {
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.review-total {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.review-avg {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1rpx solid var(--color-border-light);
}
.avg-number {
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--color-warning);
}

.bottom-placeholder {
  height: 160rpx;
}
.bottom-bar {
  @include fixed-bottom;
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
}
.bar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.btn-share {
  padding: 0 var(--spacing-lg);
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}
.btn-fav {
  padding: 0 var(--spacing-lg);
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}
.btn-fav .fav-active {
  color: #E17055;
}
.btn-contact {
  flex: 1;
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-md);
  font-weight: 600;
  padding: 24rpx 0;
  border-radius: var(--radius-full);
  text-align: center;
  @include press-feedback;
}
</style>
