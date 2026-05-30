<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { completeWxUserBind } from '@/api/wx'
import { API_BASE_URL } from '@/utils/request'

const loading = ref(false)
const status = ref<'binding' | 'success' | 'error' | 'invalid'>('binding')
const message = ref('正在准备微信绑定')

onLoad((options: Record<string, string | undefined>) => {
  const { token, code, error } = resolveBindParams(options)
  if (error === 'expired') {
    status.value = 'invalid'
    message.value = '绑定二维码已失效，请返回后台重新生成'
    return
  }
  if (!token) {
    status.value = 'invalid'
    message.value = '绑定二维码无效，请返回后台重新生成'
    return
  }
  if (!code) {
    redirectToWechatOAuth(token)
    return
  }
  bind(token, code)
})

function resolveBindParams(options: Record<string, string | undefined>) {
  const pageParams = readBrowserParams()
  const state = options.state || pageParams.state || ''
  return {
    token: options.token || pageParams.token || state,
    code: options.code || pageParams.code || '',
    error: options.error || pageParams.error || ''
  }
}

function readBrowserParams() {
  const params: Record<string, string> = {}
  // #ifdef H5
  const appendParams = (query: string) => {
    const normalized = query.startsWith('?') ? query.slice(1) : query
    if (!normalized) {
      return
    }
    new URLSearchParams(normalized).forEach((value, key) => {
      if (value && !params[key]) {
        params[key] = value
      }
    })
  }

  appendParams(window.location.search)
  const hashQueryIndex = window.location.hash.indexOf('?')
  if (hashQueryIndex >= 0) {
    appendParams(window.location.hash.slice(hashQueryIndex + 1))
  }
  // #endif
  return params
}

function redirectToWechatOAuth(token: string) {
  // #ifdef H5
  const ua = window.navigator.userAgent.toLowerCase()
  if (!ua.includes('micromessenger')) {
    status.value = 'invalid'
    message.value = '请使用微信扫码打开绑定页面'
    return
  }
  window.location.replace(`${API_BASE_URL}/wx/mp/oauth/authorize?token=${encodeURIComponent(token)}`)
  // #endif
}

async function bind(token: string, code: string) {
  loading.value = true
  status.value = 'binding'
  message.value = '正在绑定微信，请稍候'
  try {
    await completeWxUserBind({ token, code })
    status.value = 'success'
    message.value = '微信绑定成功，可以关闭当前页面'
  } catch (error: any) {
    status.value = 'error'
    message.value = error?.message || '微信绑定失败，请返回后台重新生成二维码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="wx-bind-page">
    <view class="status-card">
      <view class="status-icon" :class="status">
        <text v-if="status === 'success'">✓</text>
        <text v-else-if="status === 'error' || status === 'invalid'">!</text>
        <text v-else>...</text>
      </view>
      <text class="title">
        {{ status === 'success' ? '绑定成功' : status === 'binding' ? '微信绑定' : '绑定失败' }}
      </text>
      <text class="desc">{{ message }}</text>
      <view v-if="loading" class="loading-bar" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wx-bind-page {
  min-height: 100vh;
  padding: 160rpx 40rpx 40rpx;
  background: var(--color-bg-page);
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 64rpx 40rpx;
  border-radius: var(--radius-xl);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-md);
}

.status-icon {
  width: 112rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  background: var(--color-primary);

  &.success {
    background: var(--color-success);
  }

  &.error,
  &.invalid {
    background: var(--color-danger);
  }
}

.title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.desc {
  text-align: center;
  line-height: 1.6;
  font-size: var(--font-base);
  color: var(--color-text-secondary);
}

.loading-bar {
  width: 180rpx;
  height: 8rpx;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--color-primary-bg);

  &::after {
    content: '';
    display: block;
    width: 60rpx;
    height: 100%;
    border-radius: inherit;
    background: var(--color-primary);
    animation: loading 1s infinite ease-in-out;
  }
}

@keyframes loading {
  from {
    transform: translateX(-60rpx);
  }
  to {
    transform: translateX(180rpx);
  }
}
</style>
