import type { Address } from '@/types/address'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/address'
import { get, post, put, del } from '@/utils/request'

/** 获取地址列表 */
export async function getAddressList(): Promise<Address[]> {
  if (ENABLE_MOCK) {
    return mockApi.getAddressList()
  }
  return get<Address[]>('/api/c/address/list')
}

/** 新增地址 */
export async function addAddress(data: Omit<Address, 'id'>): Promise<Address> {
  if (ENABLE_MOCK) {
    return mockApi.addAddress(data)
  }
  return post<Address>('/api/c/address', data)
}

/** 更新地址 */
export async function updateAddress(data: Address): Promise<Address> {
  if (ENABLE_MOCK) {
    return mockApi.updateAddress(data)
  }
  return put<Address>('/api/c/address', data)
}

/** 删除地址 */
export async function deleteAddress(id: number): Promise<void> {
  if (ENABLE_MOCK) {
    return mockApi.deleteAddress(id)
  }
  return del(`/api/c/address/${id}`)
}

/** 设为默认地址 */
export async function setDefaultAddress(id: number): Promise<void> {
  if (ENABLE_MOCK) {
    return mockApi.setDefaultAddress(id)
  }
  return put(`/api/c/address/${id}/default`)
}
