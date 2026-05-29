import type { Order, OrderDetail, CreateOrderForm } from '@/types/order'
import type { PageQuery } from '@/types/api'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/order'
import { getPage, get, post } from '@/utils/request'

/** 获取订单列表 */
export async function getOrderList(params: PageQuery & { status?: string }): Promise<{ list: Order[]; total: number }> {
  if (ENABLE_MOCK) {
    return mockApi.getOrderList(params)
  }
  return getPage<Order>('/api/c/order/list', params)
}

/** 获取订单详情 */
export async function getOrderDetail(id: number): Promise<OrderDetail> {
  if (ENABLE_MOCK) {
    const result = await mockApi.getOrderDetail(id)
    if (!result) throw new Error('订单不存在')
    return result
  }
  return get<OrderDetail>(`/api/c/order/${id}`)
}

/** 创建订单 */
export async function createOrder(form: CreateOrderForm): Promise<{ orderNo: string }> {
  if (ENABLE_MOCK) {
    return mockApi.createOrder(form)
  }
  return post<{ orderNo: string }>('/api/c/order', form)
}
