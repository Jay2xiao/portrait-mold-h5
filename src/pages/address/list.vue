<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import type { Address } from '@/types/address'
import { getAddressList, deleteAddress, setDefaultAddress } from '@/api/address'
import { requireLogin } from '@/utils/auth'

const addresses = ref<Address[]>([])
const loading = ref(true)

onShow(() => {
  if (requireLogin()) {
    loadAddresses()
  }
})

async function loadAddresses() {
  loading.value = true
  try {
    addresses.value = await getAddressList()
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function onSetDefault(id: number) {
  try {
    await setDefaultAddress(id)
    await loadAddresses()
  } catch (e) {
    uni.showToast({ title: '设置失败', icon: 'none' })
  }
}

function onDelete(id: number) {
  uni.showModal({
    title: '提示',
    content: '确定删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAddress(id)
          await loadAddresses()
          uni.showToast({ title: '已删除', icon: 'success' })
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

function onEdit(id?: number) {
  const url = id ? `/pages/address/edit?id=${id}` : '/pages/address/edit'
  uni.navigateTo({ url })
}

// #ifdef MP-WEIXIN
function onImportFromWeChat() {
  uni.chooseAddress({
    success: (res) => {
      uni.navigateTo({
        url: `/pages/address/edit?importData=${encodeURIComponent(JSON.stringify({
          name: res.userName,
          phone: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          detail: res.detailInfo
        }))}`
      })
    }
  })
}
// #endif
</script>

<template>
  <view class="page-container">
    <template v-if="addresses.length">
      <view v-for="addr in addresses" :key="addr.id" class="address-card" @tap="onEdit(addr.id)">
        <view class="addr-main">
          <view class="addr-top">
            <text class="addr-name">{{ addr.name }}</text>
            <text class="addr-phone">{{ addr.phone }}</text>
            <text v-if="addr.isDefault" class="default-tag">默认</text>
          </view>
          <text class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
        </view>
        <view class="addr-actions">
          <view class="action-item" @tap.stop="onSetDefault(addr.id)">
            <view class="radio" :class="{ checked: addr.isDefault }" />
            <text>设为默认</text>
          </view>
          <view class="action-item delete" @tap.stop="onDelete(addr.id)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </template>

    <mc-empty-state v-else-if="!loading" type="address" text="暂无收货地址" btn-text="新增地址" @action="onEdit()" />

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-area-bottom">
      <!-- #ifdef MP-WEIXIN -->
      <view class="bar-btn btn-import" @tap="onImportFromWeChat">
        <text>从微信导入</text>
      </view>
      <!-- #endif -->
      <view class="bar-btn btn-add" @tap="onEdit()">
        <text>新增地址</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.address-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.addr-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.addr-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
}
.addr-phone {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.default-tag {
  font-size: var(--font-xs);
  color: var(--color-primary);
  background: var(--color-primary-bg);
  padding: 2rpx 12rpx;
  border-radius: var(--radius-full);
}
.addr-detail {
  font-size: var(--font-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.addr-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1rpx solid var(--color-border-light);
}
.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  &.delete { color: var(--color-danger); }
}
.radio {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid var(--color-border);
  border-radius: 50%;
  &.checked {
    border-color: var(--color-primary);
    background: var(--color-primary);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: white;
    }
  }
}

.bottom-bar {
  @include fixed-bottom;
  display: flex;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
}
.bar-btn {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: var(--radius-full);
  font-size: var(--font-md);
  font-weight: 600;
  @include press-feedback;
}
.btn-import {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}
.btn-add {
  background: var(--gradient-primary);
  color: var(--color-text-white);
}
</style>
