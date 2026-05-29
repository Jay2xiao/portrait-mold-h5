import type { Address } from '@/types/address'
import { mockDelay, ENABLE_MOCK } from './index'

/** Mock 地址数据 */
let addresses: Address[] = [
  { id: 1, name: '张三', phone: '13812348000', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路1号XX大厦A座1001', isDefault: true },
  { id: 2, name: '张三', phone: '13812348000', province: '广东省', city: '广州市', district: '天河区', detail: '天河路385号太古汇北塔1205', isDefault: false },
  { id: 3, name: '李四', phone: '13912345678', province: '北京市', city: '北京市', district: '朝阳区', detail: '建国路88号SOHO现代城B座2306', isDefault: false }
]

let nextId = 4

// ===== Mock API =====

/** 获取地址列表 */
export async function getAddressList(): Promise<Address[]> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay(100, 300)
  return [...addresses]
}

/** 新增地址 */
export async function addAddress(data: Omit<Address, 'id'>): Promise<Address> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  if (data.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }))
  }

  const address: Address = { ...data, id: nextId++ }
  addresses.unshift(address)
  return address
}

/** 更新地址 */
export async function updateAddress(data: Address): Promise<Address> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  if (data.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }))
  }

  const index = addresses.findIndex(a => a.id === data.id)
  if (index !== -1) {
    addresses[index] = { ...data }
    return addresses[index]
  }
  throw new Error('地址不存在')
}

/** 删除地址 */
export async function deleteAddress(id: number): Promise<void> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  addresses = addresses.filter(a => a.id !== id)
}

/** 设为默认地址 */
export async function setDefaultAddress(id: number): Promise<void> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  addresses = addresses.map(a => ({ ...a, isDefault: a.id === id }))
}
