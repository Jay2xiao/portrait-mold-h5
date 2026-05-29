<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Address } from '@/types/address'
import { getAddressList, addAddress, updateAddress } from '@/api/address'

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const editId = ref<number | null>(null)
const regionValue = ref<string[]>([])
const loading = ref(false)

onLoad((options) => {
  if (options?.id) {
    editId.value = parseInt(options.id)
    loadAddress()
    uni.setNavigationBarTitle({ title: '编辑地址' })
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' })
  }

  // 从微信导入
  if (options?.importData) {
    try {
      const data = JSON.parse(decodeURIComponent(options.importData))
      form.value = { ...form.value, ...data }
      regionValue.value = [data.province, data.city, data.district]
    } catch (e) { /* ignore */ }
  }
})

async function loadAddress() {
  try {
    const list = await getAddressList()
    const addr = list.find(a => a.id === editId.value)
    if (addr) {
      form.value = { ...addr }
      regionValue.value = [addr.province, addr.city, addr.district]
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

function onRegionChange(e: any) {
  const val = e.detail.value
  regionValue.value = val
  form.value.province = val[0]
  form.value.city = val[1]
  form.value.district = val[2]
}

function validate(): boolean {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入收货人', icon: 'none' }); return false
  }
  if (!/^1\d{10}$/.test(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' }); return false
  }
  if (!form.value.province) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' }); return false
  }
  if (!form.value.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' }); return false
  }
  return true
}

async function onSave() {
  if (!validate()) return
  loading.value = true
  try {
    if (editId.value) {
      await updateAddress({ id: editId.value, ...form.value })
    } else {
      await addAddress(form.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="page-container">
    <view class="form-card">
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input class="form-input" v-model="form.name" placeholder="请输入收货人姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="form.phone" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-item">
        <text class="form-label">所在地区</text>
        <picker mode="region" :value="regionValue" @change="onRegionChange">
          <view class="picker-value" :class="{ placeholder: !form.province }">
            {{ form.province ? `${form.province} ${form.city} ${form.district}` : '请选择省市区' }}
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <textarea class="form-textarea" v-model="form.detail" placeholder="请输入详细地址" />
      </view>
      <view class="form-item switch-item">
        <text class="form-label">设为默认地址</text>
        <switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" color="#6C5CE7" />
      </view>
    </view>

    <view class="save-btn" :class="{ disabled: loading }" @tap="onSave">
      <text>{{ loading ? '保存中...' : '保存地址' }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.form-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-lg);
  padding: 0 var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.form-item {
  padding: var(--spacing-lg) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  &:last-child { border-bottom: none; }
}
.form-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: 12rpx;
  display: block;
}
.form-input {
  width: 100%;
  font-size: var(--font-base);
  color: var(--color-text-primary);
  padding: 8rpx 0;
}
.form-textarea {
  width: 100%;
  font-size: var(--font-base);
  color: var(--color-text-primary);
  min-height: 120rpx;
}
.picker-value {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  padding: 8rpx 0;
  &.placeholder {
    color: var(--color-text-placeholder);
  }
}
.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.save-btn {
  margin: var(--spacing-xl) var(--spacing-lg);
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
