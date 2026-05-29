<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useFavoriteStore } from '@/stores/favorite'
import { requireLogin } from '@/utils/auth'
import { maskPhone } from '@/utils/format'

const userStore = useUserStore()
const appStore = useAppStore()
const favoriteStore = useFavoriteStore()

const menuList = [
  { label: '我的收藏', desc: '我关注的建模师', icon: 'favorite', url: '/pages/favorite/list', needLogin: true },
  { label: '收货地址', desc: '管理您的收货地址', icon: 'location', url: '/pages/address/list', needLogin: true },
  { label: '我的订单', desc: '查看修模订单', icon: 'order', url: '', tab: '/pages/order/list', needLogin: true },
  { label: '手机绑定', desc: '绑定/更换手机号', icon: 'phone', url: '/pages/phone-bind/index', needLogin: true },
  { label: '联系客服', desc: '在线咨询问题', icon: 'service', url: '/pages/contact/index', needLogin: false },
  { label: '设置', desc: '账号与隐私设置', icon: 'info', url: '', needLogin: false, comingSoon: true }
]

function onMenuTap(item: typeof menuList[0]) {
  if (item.needLogin && !requireLogin()) return
  if (item.comingSoon) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  if (item.tab) {
    uni.switchTab({ url: item.tab })
  } else if (item.url) {
    uni.navigateTo({ url: item.url })
  }
}

function onLoginTap() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

function onPhoneBind() {
  if (!requireLogin()) return
  uni.navigateTo({ url: '/pages/phone-bind/index' })
}

function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'none' })
      }
    }
  })
}
</script>

<template>
  <view class="page-container">
    <!-- 头部 -->
    <view class="profile-header" :style="{ paddingTop: (appStore.statusBarHeight + 20) + 'px' }">
      <view class="user-card" @tap="onLoginTap">
        <template v-if="userStore.isLoggedIn">
          <image class="user-avatar" :src="userStore.userInfo?.avatar || '/static/avatar-default.png'" mode="aspectFill" />
          <view class="user-info">
            <text class="user-name">{{ userStore.displayName }}</text>
            <view v-if="userStore.hasPhone" class="user-phone" @tap.stop="onPhoneBind">
              <text>{{ maskPhone(userStore.userInfo?.phone || '') }}</text>
            </view>
            <view v-else class="user-phone bind-tip" @tap.stop="onPhoneBind">
              <text>未绑定手机，点击绑定</text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="user-avatar-placeholder">
            <!-- #ifdef H5 -->
            <svg viewBox="0 0 24 24" width="28px" height="28px" fill="#A29BFE">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <!-- #endif -->
          </view>
          <view class="user-info">
            <text class="user-name">点击登录</text>
            <text class="user-desc">登录后享受更多服务</text>
          </view>
        </template>
        <view class="arrow-right">
          <!-- #ifdef H5 -->
          <svg viewBox="0 0 24 24" width="16px" height="16px" fill="rgba(255,255,255,0.6)">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
          <!-- #endif -->
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view
        v-for="item in menuList"
        :key="item.label"
        class="menu-item"
        @tap="onMenuTap(item)"
      >
        <view class="menu-left">
          <view class="menu-icon-wrap">
            <!-- #ifdef H5 -->
            <svg viewBox="0 0 24 24" width="18px" height="18px" fill="#6C5CE7">
              <path :d="
                item.icon === 'location' ? 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' :
                item.icon === 'order' ? 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' :
                item.icon === 'phone' ? 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' :
                item.icon === 'service' ? 'M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.96 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z' :
                'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
              "/>
            </svg>
            <!-- #endif -->
          </view>
          <view class="menu-text">
            <text class="menu-label">{{ item.label }}</text>
            <text class="menu-desc">{{ item.desc }}</text>
          </view>
        </view>
        <view class="arrow-right">
          <!-- #ifdef H5 -->
          <svg viewBox="0 0 24 24" width="14px" height="14px" fill="#B2BEC3">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
          <!-- #endif -->
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="userStore.isLoggedIn" class="logout-section">
      <view class="logout-btn" @tap="onLogout">
        <text>退出登录</text>
      </view>
    </view>

    <view class="bottom-placeholder" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.profile-header {
  background: var(--gradient-header);
  padding-bottom: 60rpx;
  border-radius: 0 0 40% 40%;
}
.user-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-lg) 0;
  @include press-feedback;
}
.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: var(--spacing-lg);
  flex-shrink: 0;
}
.user-avatar-placeholder {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  margin-right: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
}
.user-name {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-white);
  display: block;
}
.user-phone {
  margin-top: 8rpx;
}
.user-phone text {
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.8);
}
.bind-tip text {
  color: var(--color-warning) !important;
}
.user-desc {
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-top: 4rpx;
}
.arrow-right {
  flex-shrink: 0;
}

.menu-section {
  margin: -20rpx var(--spacing-lg) 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 2;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1rpx solid var(--color-border-light);
  @include press-feedback;

  &:last-child {
    border-bottom: none;
  }
}
.menu-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
.menu-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius-md);
  background: var(--color-primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-label {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  font-weight: 500;
  display: block;
}
.menu-desc {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  display: block;
  margin-top: 4rpx;
}

.logout-section {
  padding: var(--spacing-xl) var(--spacing-lg);
}
.logout-btn {
  text-align: center;
  padding: 28rpx 0;
  border-radius: var(--radius-full);
  background: var(--color-bg-card);
  color: var(--color-danger);
  font-size: var(--font-md);
  box-shadow: var(--shadow-sm);
  @include press-feedback;
}

.bottom-placeholder {
  height: 120rpx;
}
</style>
