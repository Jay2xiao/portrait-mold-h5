<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createReview } from '@/api/review'

const orderId = ref(0)
const rating = ref(5)
const content = ref('')
const images = ref<string[]>([])
const submitting = ref(false)

onLoad((options) => {
  if (options?.orderId) {
    orderId.value = parseInt(options.orderId)
  }
})

function onRatingChange(val: number) {
  rating.value = val
}

async function onSubmit() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入评价内容', icon: 'none' })
    return
  }
  if (content.value.trim().length < 5) {
    uni.showToast({ title: '评价内容至少5个字', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await createReview({
      orderId: orderId.value,
      rating: rating.value,
      content: content.value,
      images: images.value
    })

    uni.showToast({ title: '评价成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) {
    uni.showToast({ title: '评价失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="page-container">
    <view class="review-card">
      <!-- 评分 -->
      <view class="rating-section">
        <text class="section-label">服务评分</text>
        <mc-star-rating :value="rating" :readonly="false" size="lg" @change="onRatingChange" />
      </view>

      <!-- 评价内容 -->
      <view class="content-section">
        <text class="section-label">评价内容</text>
        <textarea
          class="review-textarea"
          v-model="content"
          placeholder="请分享您的使用体验，帮助其他用户做出选择..."
          maxlength="500"
          :auto-height="false"
        />
        <text class="char-count">{{ content.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="image-section">
        <text class="section-label">上传图片</text>
        <mc-image-uploader v-model="images" :max="6" />
      </view>
    </view>

    <view class="submit-btn" :class="{ disabled: submitting }" @tap="onSubmit">
      <text>{{ submitting ? '提交中...' : '发表评价' }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.review-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.rating-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-lg);
  border-bottom: 1rpx solid var(--color-border-light);
  margin-bottom: var(--spacing-lg);
}
.section-label {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: block;
}
.content-section {
  margin-bottom: var(--spacing-lg);
}
.review-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: var(--spacing-md);
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  color: var(--color-text-primary);
  line-height: 1.8;
}
.char-count {
  text-align: right;
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  margin-top: 8rpx;
  display: block;
}
.image-section {
  margin-bottom: var(--spacing-md);
}
.submit-btn {
  margin: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-md);
  font-weight: 600;
  text-align: center;
  padding: 32rpx 0;
  border-radius: var(--radius-full);

  &.disabled { opacity: 0.6; }
  &:active { transform: scale(0.97); }
}
</style>
