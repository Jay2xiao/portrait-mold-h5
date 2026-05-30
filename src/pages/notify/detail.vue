<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { API_BASE_URL } from '@/utils/request'
import { getWxNotificationDetail, type WxNotificationDetail, type WxNotificationMedia } from '@/api/wx'

const loading = ref(true)
const errorText = ref('')
const detail = ref<WxNotificationDetail | null>(null)
const notificationId = ref('')
const redirectUrl = ref('')

const images = computed(() => detail.value?.images || [])
const attachments = computed(() => detail.value?.attachments || [])
const fields = computed(() => detail.value?.fields || [])

onLoad((query) => {
  const params = resolveNotificationParams(query as Record<string, string | undefined>)
  notificationId.value = params.id
  redirectUrl.value = params.redirect
  const code = params.code

  if (!notificationId.value) {
    loading.value = false
    errorText.value = '通知不存在'
    return
  }

  if (!code) {
    startOauth()
    return
  }

  loadDetail(code)
})

function resolveNotificationParams(query: Record<string, string | undefined>) {
  const browserParams = readBrowserParams()
  return {
    id: String(query?.id || browserParams.id || browserParams.state || ''),
    redirect: String(query?.redirect || browserParams.redirect || ''),
    code: String(query?.code || browserParams.code || '')
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

function startOauth() {
  // #ifdef H5
  if (!isWechatBrowser()) {
    loading.value = false
    errorText.value = '请在微信中打开通知'
    return
  }
  const url = `${API_BASE_URL}/wx/mp/oauth/notification-authorize?id=${encodeURIComponent(notificationId.value)}&redirect=${encodeURIComponent(redirectUrl.value)}`
  window.location.replace(url)
  // #endif
}

async function loadDetail(code: string) {
  try {
    detail.value = await getWxNotificationDetail(notificationId.value, code)
    if (detail.value?.redirectUrl && !redirectUrl.value) {
      redirectUrl.value = detail.value.redirectUrl
    }
  } catch (e: any) {
    errorText.value = e?.message || '通知加载失败'
  } finally {
    loading.value = false
  }
}

function isWechatBrowser() {
  // #ifdef H5
  return /MicroMessenger/i.test(window.navigator.userAgent)
  // #endif
  return false
}

function previewImage(index: number) {
  const urls = images.value.map((item) => item.url).filter(Boolean)
  if (!urls.length) {
    return
  }
  uni.previewImage({
    urls,
    current: urls[index]
  })
}

function openAttachment(item: WxNotificationMedia) {
  if (!item.url) {
    return
  }
  // #ifdef H5
  window.location.href = item.url
  // #endif
}

function openBackendPage() {
  const url = redirectUrl.value || detail.value?.jumpUrl
  if (!url) {
    uni.showToast({ title: '暂无后台入口', icon: 'none' })
    return
  }
  // #ifdef H5
  window.location.href = url
  // #endif
}
</script>

<template>
  <view class="notify-page">
    <view v-if="loading" class="state">加载中...</view>

    <view v-else-if="errorText" class="state error">
      <text>{{ errorText }}</text>
    </view>

    <view v-else-if="detail" class="content">
      <view class="header">
        <text class="type">{{ detail.bizType || '业务通知' }}</text>
        <text class="title">{{ detail.title || '通知详情' }}</text>
        <text v-if="detail.createTime" class="time">{{ detail.createTime }}</text>
      </view>

      <view v-if="detail.content" class="section">
        <text class="section-title">通知内容</text>
        <text class="paragraph">{{ detail.content }}</text>
      </view>

      <view v-if="fields.length" class="section">
        <text class="section-title">业务信息</text>
        <view v-for="item in fields" :key="item.label" class="field-row">
          <text class="field-label">{{ item.label }}</text>
          <text class="field-value">{{ item.value }}</text>
        </view>
      </view>

      <view v-if="images.length" class="section">
        <text class="section-title">图片</text>
        <view class="image-grid">
          <image
            v-for="(item, index) in images"
            :key="item.url"
            class="image-item"
            :src="item.url"
            mode="aspectFill"
            @tap="previewImage(index)"
          />
        </view>
      </view>

      <view v-if="attachments.length" class="section">
        <text class="section-title">附件</text>
        <view
          v-for="item in attachments"
          :key="item.url"
          class="attachment-row"
          @tap="openAttachment(item)"
        >
          <text class="attachment-name">{{ item.name || '查看附件' }}</text>
          <text class="attachment-action">打开</text>
        </view>
      </view>

      <button class="backend-btn" @tap="openBackendPage">查看后台详情</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.notify-page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f5f6fa;
}

.state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #636e72;
  font-size: 30rpx;
}

.error {
  color: #d63031;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.header,
.section {
  padding: 28rpx;
  border-radius: 12rpx;
  background: #ffffff;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.type {
  color: #0984e3;
  font-size: 24rpx;
}

.title {
  color: #2d3436;
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.35;
}

.time {
  color: #b2bec3;
  font-size: 24rpx;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  color: #2d3436;
  font-size: 30rpx;
  font-weight: 600;
}

.paragraph {
  color: #636e72;
  font-size: 28rpx;
  line-height: 1.7;
}

.field-row,
.attachment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  min-height: 58rpx;
  border-bottom: 1rpx solid #edf0f2;
}

.field-row:last-child,
.attachment-row:last-child {
  border-bottom: 0;
}

.field-label {
  flex-shrink: 0;
  color: #636e72;
  font-size: 26rpx;
}

.field-value {
  color: #2d3436;
  font-size: 26rpx;
  text-align: right;
  word-break: break-all;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.image-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8rpx;
  background: #dfe6e9;
}

.attachment-name {
  flex: 1;
  color: #2d3436;
  font-size: 26rpx;
  word-break: break-all;
}

.attachment-action {
  color: #0984e3;
  font-size: 26rpx;
}

.backend-btn {
  height: 88rpx;
  border-radius: 44rpx;
  background: #0984e3;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 88rpx;
}
</style>
