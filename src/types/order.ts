/** 订单状态 */
export type OrderStatus = 'PENDING' | 'REPAIRING' | 'REVIEWING' | 'COMPLETED' | 'CANCELLED'

/** 订单列表项 */
export interface Order {
  id: number
  orderNo: string
  productName: string
  productType: string
  businessStatus: OrderStatus
  saleAmountTotal: number
  createTime: string
  modelerName: string
  modelerAvatar: string
  productImageUrl: string
}

/** 订单详情 */
export interface OrderDetail extends Order {
  timeline: OrderTimelineItem[]
  remark: string
  receiverNameSnapshot: string
  receiverPhoneSnapshot: string
  receiverAddressSnapshot: string
  originalImageUrls: string[]
  quantity: number
}

/** 订单时间线项 */
export interface OrderTimelineItem {
  time: string
  action: string
  remark?: string
}

/** 创建订单表单 */
export interface CreateOrderForm {
  modelerId: number
  productType: string
  productName: string
  quantity: number
  remark: string
  originalImages: string[]
  addressId: number
}

/** 订单状态配置 */
export interface OrderStatusConfig {
  label: string
  color: string
  bgColor: string
}
