<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Address } from '@/types/address'
import type { ModelerDetail, PriceItem } from '@/types/modeler'
import { getModelerDetail } from '@/api/modeler'
import { createOrder } from '@/api/order'
import { getAddressList } from '@/api/address'
import { formatPrice } from '@/utils/format'

const modelerId = ref(0)
const modeler = ref<ModelerDetail | null>(null)
const addresses = ref<Address[]>([])
const selectedPrice = ref<PriceItem | null>(null)
const selectedAddress = ref<Address | null>(null)
const productName = ref('')
const remark = ref('')
const submitting = ref(false)

onLoad((options) => {
  if (options?.modelerId) {
    modelerId.value = parseInt(options.modelerId)
  }
})

onMounted(async () => {
  if (modelerId.value) {
    try {
      modeler.value = await getModelerDetail(modelerId.value)
      if (modeler.value?.priceList?.length) {
        selectedPrice.value = modeler.value.priceList[0]
      }
    } catch (e) { /* ignore */ }
  }
  try {
    addresses.value = await getAddressList()
    selectedAddress.value = addresses.value.find(a => a.isDefault) || addresses.value[0] || null
  } catch (e) { /* ignore */ }
})

function onSelectPrice(item: PriceItem) {
  selectedPrice.value = item
  if (!productName.value) {
    productName.value = item.serviceName
  }
}

function onSelectAddress() {
  uni.navigateTo({
    url: '/pages/address/list',
    events: {
      selectAddress: (addr: Address) => {
        selectedAddress.value = addr
      }
    }
  })
}

function validate(): boolean {
  if (!selectedPrice.value) {
    uni.showToast({ title: '请选择服务类型', icon: 'none' }); return false
  }
  if (!productName.value.trim()) {
    uni.showToast({ title: '请输入产品名称', icon: 'none' }); return false
  }
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' }); return false
  }
  return true
}

async function onSubmit() {
  if (!validate() || !selectedPrice.value || !selectedAddress.value) return

  submitting.value = true
  try {
    const result = await createOrder({
      modelerId: modelerId.value,
      productType: selectedPrice.value.serviceName,
      productName: productName.value,
      quantity: 1,
      remark: remark.value,
      originalImages: [],
      addressId: selectedAddress.value.id
    })

    uni.showModal({
      title: '下单成功',
      content: `订单号：${result.orderNo}，建模师将尽快确认`,
      showCancel: false,
      success: () => {
        uni.switchTab({ url: '/pages/order/list' })
      }
    })
  } catch (e) {
    uni.showToast({ title: '下单失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="page-container">
    <!-- 建模师信息 -->
    <view v-if="modeler" class="modeler-brief">
      <image class="brief-avatar" :src="modeler.avatar" mode="aspectFill" />
      <view class="brief-info">
        <text class="brief-name">{{ modeler.name }}</text>
        <text class="brief-title">{{ modeler.title }}</text>
      </view>
    </view>

    <!-- 选择服务类型 -->
    <view class="section-card">
      <text class="section-title">选择服务</text>
      <view class="price-options">
        <view
          v-for="item in modeler?.priceList || []"
          :key="item.id"
          class="price-option"
          :class="{ selected: selectedPrice?.id === item.id }"
          @tap="onSelectPrice(item)"
        >
          <view class="option-left">
            <text class="option-name">{{ item.serviceName }}</text>
            <text class="option-desc">{{ item.description }}</text>
          </view>
          <view class="option-right">
            <text class="option-price">¥{{ item.price }}</text>
            <text class="option-days">{{ item.deliveryDays }}天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 产品信息 -->
    <view class="section-card">
      <text class="section-title">产品信息</text>
      <view class="form-item">
        <text class="form-label">产品名称</text>
        <input class="form-input" v-model="productName" placeholder="请输入产品名称" />
      </view>
      <view class="form-item">
        <text class="form-label">备注说明</text>
        <textarea class="form-textarea" v-model="remark" placeholder="请描述您的需求（选填）" />
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="section-card" @tap="onSelectAddress">
      <text class="section-title">收货地址</text>
      <view v-if="selectedAddress" class="addr-brief">
        <view class="addr-info">
          <text class="addr-name">{{ selectedAddress.name }} {{ selectedAddress.phone }}</text>
          <text class="addr-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
        </view>
        <text class="addr-arrow">></text>
      </view>
      <view v-else class="addr-empty">
        <text>请选择收货地址</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-placeholder" />
    <view class="bottom-bar safe-area-bottom">
      <view class="price-summary">
        <text class="summary-label">合计：</text>
        <text class="summary-price">¥{{ selectedPrice ? formatPrice(selectedPrice.price) : '0.00' }}</text>
      </view>
      <view class="submit-btn" :class="{ disabled: submitting }" @tap="onSubmit">
        <text>{{ submitting ? '提交中...' : '提交订单' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.modeler-brief {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-bg-card);
  margin: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.brief-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: var(--spacing-md);
}
.brief-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
}
.brief-title {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.section-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--spacing-md) var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}
.section-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.price-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 2rpx solid var(--color-border-light);
  border-radius: var(--radius-md);
  margin-bottom: 12rpx;
  transition: all var(--transition-fast);

  &.selected {
    border-color: var(--color-primary);
    background: var(--color-primary-bg);
  }
}
.option-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  display: block;
}
.option-desc {
  font-size: var(--font-xs);
  color: var(--color-text-placeholder);
}
.option-right {
  text-align: right;
}
.option-price {
  font-size: var(--font-md);
  color: var(--color-danger);
  font-weight: 600;
  display: block;
}
.option-days {
  font-size: var(--font-xs);
  color: var(--color-success);
}

.form-item {
  margin-bottom: var(--spacing-md);
}
.form-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8rpx;
  display: block;
}
.form-input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
}
.form-textarea {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  min-height: 160rpx;
}

.addr-brief {
  display: flex;
  align-items: center;
}
.addr-info { flex: 1; }
.addr-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 4rpx;
}
.addr-detail {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.addr-arrow {
  color: var(--color-text-placeholder);
  font-size: var(--font-lg);
}
.addr-empty {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-placeholder);
  font-size: var(--font-base);
}

.bottom-placeholder { height: 160rpx; }
.bottom-bar {
  @include fixed-bottom;
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
}
.price-summary {
  display: flex;
  align-items: baseline;
}
.summary-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}
.summary-price {
  font-size: var(--font-xl);
  color: var(--color-danger);
  font-weight: 700;
}
.submit-btn {
  background: var(--gradient-primary);
  color: var(--color-text-white);
  font-size: var(--font-md);
  font-weight: 600;
  padding: 24rpx 60rpx;
  border-radius: var(--radius-full);
  @include press-feedback;

  &.disabled { opacity: 0.6; }
}
</style>
