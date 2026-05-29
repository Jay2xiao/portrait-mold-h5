<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { navigateAfterLogin, getWxLoginCode } from '@/utils/auth'

const userStore = useUserStore()
const loading = ref(false)
const agreed = ref(false)

async function onWxLogin() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  loading.value = true
  try {
    // #ifdef MP-WEIXIN
    const code = await getWxLoginCode()
    await userStore.wxMpLogin(code)
    navigateAfterLogin()
    // #endif

    // #ifdef H5
    // H5 环境模拟登录（实际环境应通过 OAuth 静默登录，不需要此页面）
    const result = {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: 1,
        nickName: 'H5用户',
        avatar: '',
        phone: '',
        isPhoneBound: false
      },
      isNewUser: true
    }
    userStore.login(result)
    navigateAfterLogin()
    // #endif
  } catch (e) {
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="page-container login-page">
    <!-- 顶部品牌区 -->
    <view class="brand-section">
      <view class="brand-logo">
        <text class="logo-emoji">🎨</text>
      </view>
      <text class="brand-name">模匠工坊</text>
      <text class="brand-slogan">专业3D建模 · 修模服务平台</text>
    </view>

    <!-- 登录卡片 -->
    <view class="login-card">
      <text class="card-title">欢迎使用</text>
      <text class="card-desc">登录后可享受完整的建模服务</text>

      <view
        class="wx-login-btn"
        :class="{ disabled: loading }"
        @tap="onWxLogin"
      >
        <text>{{ loading ? '登录中...' : '微信一键登录' }}</text>
      </view>

      <!-- 协议 -->
      <view class="agreement-row" @tap="agreed = !agreed">
        <view class="checkbox" :class="{ checked: agreed }">
          <text v-if="agreed" class="check-mark">✓</text>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #6C5CE7 0%, #A29BFE 40%, #F5F6FA 40%);
}
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0 80rpx;
}
.brand-logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.logo-emoji {
  font-size: 64rpx;
}
.brand-name {
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--color-text-white);
  letter-spacing: 4rpx;
}
.brand-slogan {
  font-size: var(--font-base);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 12rpx;
}

.login-card {
  margin: 0 var(--spacing-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}
.card-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
}
.card-desc {
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  display: block;
  margin-top: 8rpx;
  margin-bottom: var(--spacing-xl);
}
.wx-login-btn {
  background: var(--gradient-wechat);
  color: var(--color-text-white);
  font-size: var(--font-lg);
  font-weight: 600;
  text-align: center;
  padding: 32rpx 0;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.97);
    opacity: 0.9;
  }
  &.disabled {
    opacity: 0.6;
  }
}
.agreement-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: var(--spacing-lg);
}
.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.checked {
    background: var(--color-primary);
    border-color: var(--color-primary);
  }
}
.check-mark {
  color: white;
  font-size: 22rpx;
}
.agreement-text {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}
.link {
  color: var(--color-primary);
}
</style>
