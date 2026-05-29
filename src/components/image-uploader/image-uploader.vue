<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/api/upload'

const props = withDefaults(defineProps<{
  modelValue: string[]
  max?: number
}>(), {
  max: 9
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const uploading = ref(false)

async function chooseImage() {
  if (uploading.value) return
  const remaining = props.max - props.modelValue.length
  if (remaining <= 0) {
    uni.showToast({ title: `最多上传${props.max}张`, icon: 'none' })
    return
  }

  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      uploading.value = true
      try {
        const urls: string[] = []
        for (const path of res.tempFilePaths) {
          const url = await uploadImage(path)
          urls.push(url)
        }
        emit('update:modelValue', [...props.modelValue, ...urls])
      } catch (e) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uploading.value = false
      }
    }
  })
}

function removeImage(index: number) {
  const newList = [...props.modelValue]
  newList.splice(index, 1)
  emit('update:modelValue', newList)
}

function previewImage(index: number) {
  uni.previewImage({
    urls: props.modelValue,
    current: index
  })
}
</script>

<template>
  <view class="image-uploader">
    <view class="image-list">
      <view v-for="(url, index) in modelValue" :key="index" class="image-item">
        <image class="uploaded-image" :src="url" mode="aspectFill" @tap="previewImage(index)" />
        <view class="remove-btn" @tap.stop="removeImage(index)">
          <text class="remove-text">×</text>
        </view>
      </view>
      <view
        v-if="modelValue.length < max"
        class="add-btn"
        :class="{ disabled: uploading }"
        @tap="chooseImage"
      >
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="24px" height="24px" fill="#B2BEC3">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <!-- #endif -->
        <text class="add-text">{{ uploading ? '上传中' : '添加图片' }}</text>
      </view>
    </view>
    <text class="count-tip">{{ modelValue.length }}/{{ max }}</text>
  </view>
</template>

<style lang="scss" scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}
.uploaded-image {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
}
.remove-btn {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
}
.remove-text {
  color: white;
  font-size: 28rpx;
  line-height: 1;
}
.add-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  &.disabled {
    opacity: 0.5;
  }
  &:active {
    background: var(--color-bg-page);
  }
}
.add-text {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
}
.count-tip {
  display: block;
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
  margin-top: var(--spacing-sm);
  text-align: right;
}
</style>
