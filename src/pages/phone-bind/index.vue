<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { bindPhone, bindPhoneBySms, sendSmsCode } from '@/api/user'
import { debounce } from '@/utils/format'

const userStore = useUserStore()
const loading = ref(false)
const mode = ref<'quick' | 'sms'>('quick')

// 手动输入手机号模式
const phone = ref('')
const smsCode = ref('')
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

/** 微信快捷绑定（小程序端） */
async function onQuickBind(e: any) {
  // #ifdef MP-WEIXIN
  const detail = e.detail
  if (detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '已取消授权', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const result = await bindPhone(detail.code)
    userStore.updateUserInfo({ phone: result.phone, isPhoneBound: true })
    uni.showToast({ title: '绑定成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (err) {
    uni.showToast({ title: '绑定失败', icon: 'none' })
  } finally {
    loading.value = false
  }
  // #endif
}

/** 发送验证码 */
const onSendCode = debounce(async () => {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (countdown.value > 0) return

  try {
    await sendSmsCode(phone.value)
    uni.showToast({ title: '验证码已发送', icon: 'none' })
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (err) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}, 500)

/** 短信验证码绑定 */
async function onSmsBind() {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!smsCode.value || smsCode.value.length < 4) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const result = await bindPhoneBySms(phone.value, smsCode.value)
    userStore.updateUserInfo({ phone: result.phone, isPhoneBound: true })
    uni.showToast({ title: '绑定成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (err) {
    uni.showToast({ title: '绑定失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onSkip() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-container">
    <view class="bind-header">
      <view class="header-icon">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="28px" height="28px" fill="#FFFFFF">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        <!-- #endif -->
      </view>
      <text class="header-title">绑定手机号</text>
      <text class="header-desc">绑定手机号后可接收订单通知</text>
    </view>

    <view class="bind-card">
      <!-- 切换模式 -->
      <view class="mode-switch">
        <view class="mode-item" :class="{ active: mode === 'quick' }" @tap="mode = 'quick'">
          <text>微信快捷绑定</text>
        </view>
        <view class="mode-item" :class="{ active: mode === 'sms' }" @tap="mode = 'sms'">
          <text>手动输入</text>
        </view>
      </view>

      <!-- 微信快捷绑定 -->
      <template v-if="mode === 'quick'">
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="wx-bind-btn"
          open-type="getPhoneNumber"
          @getphonenumber="onQuickBind"
          :loading="loading"
        >
          微信快捷绑定手机号
        </button>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <view class="wx-bind-btn" @tap="mode = 'sms'">
          <text>请使用手动输入方式</text>
        </view>
        <!-- #endif -->
      </template>

      <!-- 短信验证码绑定 -->
      <template v-else>
        <view class="input-group">
          <text class="input-label">手机号</text>
          <input
            class="form-input"
            type="number"
            v-model="phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        <view class="input-group">
          <text class="input-label">验证码</text>
          <view class="sms-row">
            <input
              class="form-input sms-input"
              type="number"
              v-model="smsCode"
              placeholder="请输入验证码"
              maxlength="6"
            />
            <view class="sms-btn" :class="{ disabled: countdown > 0 }" @tap="onSendCode">
              <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
            </view>
          </view>
        </view>
        <view class="sms-bind-btn" :class="{ disabled: loading }" @tap="onSmsBind">
          <text>{{ loading ? '绑定中...' : '确认绑定' }}</text>
        </view>
      </template>
    </view>

    <view class="skip-row" @tap="onSkip">
      <text>暂不绑定，稍后设置</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bind-header {
  background: var(--gradient-header);
  padding: 80rpx 40rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 40% 40%;
}
.header-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}
.header-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--color-text-white);
}
.header-desc {
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.bind-card {
  margin: -20rpx var(--spacing-lg) 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 2;
}
.mode-switch {
  display: flex;
  background: var(--color-bg-page);
  border-radius: var(--radius-full);
  padding: 6rpx;
  margin-bottom: var(--spacing-xl);
}
.mode-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &.active {
    background: var(--color-bg-card);
    color: var(--color-primary);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }
}

.wx-bind-btn {
  background: var(--gradient-wechat) !important;
  color: var(--color-text-white) !important;
  font-size: var(--font-md) !important;
  font-weight: 600;
  text-align: center;
  padding: 28rpx 0;
  border-radius: var(--radius-full);
  border: none;

  &:active {
    opacity: 0.9;
  }
}

.input-group {
  margin-bottom: var(--spacing-lg);
}
.input-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: 12rpx;
  display: block;
}
.form-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  color: var(--color-text-primary);
}
.sms-row {
  display: flex;
  gap: var(--spacing-md);
}
.sms-input {
  flex: 1;
}
.sms-btn {
  flex-shrink: 0;
  padding: 0 28rpx;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  font-size: var(--font-sm);
  font-weight: 500;

  &.disabled {
    opacity: 0.5;
  }
}
.sms-bind-btn {
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-md);
  font-weight: 600;
  text-align: center;
  padding: 28rpx 0;
  border-radius: var(--radius-full);
  margin-top: var(--spacing-md);

  &.disabled { opacity: 0.6; }
  &:active { transform: scale(0.97); }
}

.skip-row {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-sm);
  color: var(--color-text-placeholder);
}
</style>
