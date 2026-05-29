<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from '@/utils/format'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '搜索建模师、服务类型...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
}>()

const inputVal = ref(props.modelValue)

watch(() => props.modelValue, (v) => { inputVal.value = v })

const debouncedEmit = debounce((val: string) => {
  emit('update:modelValue', val)
  emit('search', val)
}, 300)

function onInput(e: any) {
  inputVal.value = e.detail.value
  debouncedEmit(inputVal.value)
}

function onClear() {
  inputVal.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

function onSearch() {
  emit('search', inputVal.value)
}
</script>

<template>
  <view class="search-bar">
    <view class="search-input-wrap">
      <!-- #ifdef H5 -->
      <svg viewBox="0 0 24 24" width="16px" height="16px" fill="#B2BEC3" class="search-icon">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <!-- #endif -->
      <input
        class="search-input"
        :value="inputVal"
        :placeholder="placeholder"
        confirm-type="search"
        @input="onInput"
        @confirm="onSearch"
      />
      <view v-if="inputVal" class="clear-btn" @tap="onClear">
        <!-- #ifdef H5 -->
        <svg viewBox="0 0 24 24" width="14px" height="14px" fill="#B2BEC3">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-bar {
  padding: 0 var(--spacing-lg);
}
.search-input-wrap {
  display: flex;
  align-items: center;
  background: var(--color-bg-page);
  border-radius: var(--radius-full);
  padding: 16rpx 24rpx;
  gap: 12rpx;
}
.search-icon {
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  font-size: var(--font-base);
  color: var(--color-text-primary);
}
.clear-btn {
  flex-shrink: 0;
  padding: 4rpx;
}
</style>
