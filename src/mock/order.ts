import type { Order, OrderDetail, OrderStatus } from '@/types/order'
import { mockDelay, mockPage, ENABLE_MOCK } from './index'

const avatarImg = (id: number) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=modeler${id}`

const productImg = (id: number) =>
  `https://picsum.photos/seed/order${id}/200/200`

/** Mock 订单数据 */
const orders: Order[] = [
  { id: 1, orderNo: 'MC20260501001', productName: 'Q版悟空手办', productType: 'Q版模型', businessStatus: 'COMPLETED', saleAmountTotal: 180, createTime: '2026-05-01 10:30:00', modelerName: '张师傅', modelerAvatar: avatarImg(1), productImageUrl: productImg(1) },
  { id: 2, orderNo: 'MC20260502002', productName: '古风侠客', productType: '人物模型', businessStatus: 'COMPLETED', saleAmountTotal: 350, createTime: '2026-05-02 14:20:00', modelerName: '张师傅', modelerAvatar: avatarImg(1), productImageUrl: productImg(2) },
  { id: 3, orderNo: 'MC20260503003', productName: 'Q版鸣人定制', productType: 'Q版模型', businessStatus: 'COMPLETED', saleAmountTotal: 200, createTime: '2026-05-03 09:15:00', modelerName: '李设计', modelerAvatar: avatarImg(2), productImageUrl: productImg(3) },
  { id: 4, orderNo: 'MC20260504004', productName: '写实人物肖像', productType: '人物模型', businessStatus: 'COMPLETED', saleAmountTotal: 500, createTime: '2026-04-20 16:40:00', modelerName: '王工匠', modelerAvatar: avatarImg(3), productImageUrl: productImg(4) },
  { id: 5, orderNo: 'MC20260505005', productName: '机甲战士修复', productType: '修模服务', businessStatus: 'COMPLETED', saleAmountTotal: 120, createTime: '2026-04-18 11:00:00', modelerName: '陈大师', modelerAvatar: avatarImg(4), productImageUrl: productImg(5) },
  { id: 6, orderNo: 'MC20260506006', productName: 'Q版宠物狗', productType: 'Q版模型', businessStatus: 'COMPLETED', saleAmountTotal: 150, createTime: '2026-04-15 08:30:00', modelerName: '赵艺师', modelerAvatar: avatarImg(5), productImageUrl: productImg(6) },
  { id: 7, orderNo: 'MC20260507007', productName: '场景微缩模型', productType: '场景建模', businessStatus: 'COMPLETED', saleAmountTotal: 800, createTime: '2026-04-10 13:00:00', modelerName: '周师傅', modelerAvatar: avatarImg(7), productImageUrl: productImg(7) },
  { id: 8, orderNo: 'MC20260508008', productName: '动漫少女手办', productType: '人物模型', businessStatus: 'COMPLETED', saleAmountTotal: 280, createTime: '2026-04-08 10:00:00', modelerName: '吴艺人', modelerAvatar: avatarImg(8), productImageUrl: productImg(8) },
  { id: 9, orderNo: 'MC20260510009', productName: 'Q版路飞', productType: 'Q版模型', businessStatus: 'REPAIRING', saleAmountTotal: 180, createTime: '2026-05-10 09:00:00', modelerName: '李设计', modelerAvatar: avatarImg(2), productImageUrl: productImg(9) },
  { id: 10, orderNo: 'MC20260511010', productName: '写实铠甲武士', productType: '人物模型', businessStatus: 'REPAIRING', saleAmountTotal: 450, createTime: '2026-05-11 14:30:00', modelerName: '张师傅', modelerAvatar: avatarImg(1), productImageUrl: productImg(10) },
  { id: 11, orderNo: 'MC20260512011', productName: '机甲模型修复', productType: '修模服务', businessStatus: 'REPAIRING', saleAmountTotal: 200, createTime: '2026-05-12 11:00:00', modelerName: '孙大师', modelerAvatar: avatarImg(9), productImageUrl: productImg(11) },
  { id: 12, orderNo: 'MC20260513012', productName: '卡通猫咪定制', productType: 'Q版模型', businessStatus: 'REPAIRING', saleAmountTotal: 120, createTime: '2026-05-13 16:00:00', modelerName: '赵艺师', modelerAvatar: avatarImg(5), productImageUrl: productImg(12) },
  { id: 13, orderNo: 'MC20260514013', productName: '影视角色手办', productType: '人物模型', businessStatus: 'REPAIRING', saleAmountTotal: 380, createTime: '2026-05-14 10:20:00', modelerName: '吴艺人', modelerAvatar: avatarImg(8), productImageUrl: productImg(13) },
  { id: 14, orderNo: 'MC20260515014', productName: 'Q版皮卡丘', productType: 'Q版模型', businessStatus: 'PENDING', saleAmountTotal: 160, createTime: '2026-05-15 08:00:00', modelerName: '张师傅', modelerAvatar: avatarImg(1), productImageUrl: productImg(14) },
  { id: 15, orderNo: 'MC20260516015', productName: '建筑微缩模型', productType: '场景建模', businessStatus: 'PENDING', saleAmountTotal: 1200, createTime: '2026-05-16 13:00:00', modelerName: '周师傅', modelerAvatar: avatarImg(7), productImageUrl: productImg(15) },
  { id: 16, orderNo: 'MC20260517016', productName: '批量Q版头像', productType: 'Q版模型', businessStatus: 'PENDING', saleAmountTotal: 450, createTime: '2026-05-17 09:30:00', modelerName: '林师傅', modelerAvatar: avatarImg(12), productImageUrl: productImg(16) },
  { id: 17, orderNo: 'MC20260518017', productName: '写实肖像定制', productType: '人物模型', businessStatus: 'REVIEWING', saleAmountTotal: 600, createTime: '2026-05-08 15:00:00', modelerName: '黄工匠', modelerAvatar: avatarImg(11), productImageUrl: productImg(17) },
  { id: 18, orderNo: 'MC20260519018', productName: '科幻武器道具', productType: '机甲模型', businessStatus: 'REVIEWING', saleAmountTotal: 350, createTime: '2026-05-07 10:45:00', modelerName: '孙大师', modelerAvatar: avatarImg(9), productImageUrl: productImg(18) },
  { id: 19, orderNo: 'MC20260320019', productName: '旧模型翻新', productType: '修模服务', businessStatus: 'CANCELLED', saleAmountTotal: 80, createTime: '2026-03-20 11:00:00', modelerName: '刘工匠', modelerAvatar: avatarImg(6), productImageUrl: productImg(19) },
  { id: 20, orderNo: 'MC20260325020', productName: 'Q版全家福', productType: 'Q版模型', businessStatus: 'CANCELLED', saleAmountTotal: 500, createTime: '2026-03-25 14:00:00', modelerName: '杨师傅', modelerAvatar: avatarImg(10), productImageUrl: productImg(20) }
]

/** 订单时间线生成 */
function generateTimeline(order: Order): { time: string; action: string; remark?: string }[] {
  const timeline = [
    { time: order.createTime, action: '订单创建', remark: '您已成功提交订单' }
  ]

  if (order.businessStatus !== 'PENDING' && order.businessStatus !== 'CANCELLED') {
    timeline.push({ time: addHours(order.createTime, 2), action: '建模师已接单', remark: `${order.modelerName}已接受您的订单` })
    timeline.push({ time: addHours(order.createTime, 4), action: '开始修模', remark: '建模师已开始处理您的模型' })
  }

  if (order.businessStatus === 'REVIEWING' || order.businessStatus === 'COMPLETED') {
    timeline.push({ time: addHours(order.createTime, 48), action: '效果图已提交', remark: '建模师已上传修模效果图，请验收' })
  }

  if (order.businessStatus === 'COMPLETED') {
    timeline.push({ time: addHours(order.createTime, 72), action: '订单完成', remark: '您已确认验收，订单完成' })
  }

  if (order.businessStatus === 'CANCELLED') {
    timeline.push({ time: addHours(order.createTime, 1), action: '订单已取消', remark: '用户主动取消' })
  }

  return timeline
}

function addHours(dateStr: string, hours: number): string {
  const date = new Date(dateStr.replace(/-/g, '/'))
  date.setTime(date.getTime() + hours * 3600 * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// ===== Mock API =====

/** 获取订单列表 */
export async function getOrderList(params: {
  status?: string; pageNum: number; pageSize: number
}): Promise<{ list: Order[]; total: number }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  let filtered = [...orders]
  if (params.status && params.status !== 'ALL') {
    filtered = filtered.filter(o => o.businessStatus === params.status)
  }

  // 按创建时间倒序
  filtered.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

  return mockPage(filtered, params.pageNum, params.pageSize)
}

/** 获取订单详情 */
export async function getOrderDetail(id: number): Promise<OrderDetail | null> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  const order = orders.find(o => o.id === id)
  if (!order) return null

  return {
    ...order,
    timeline: generateTimeline(order),
    remark: '请尽量还原照片中的细节，头部比例稍大一点',
    receiverNameSnapshot: '张三',
    receiverPhoneSnapshot: '138****8000',
    receiverAddressSnapshot: '广东省深圳市南山区科技园路1号',
    originalImageUrls: [
      `https://picsum.photos/seed/orig${id}a/400/400`,
      `https://picsum.photos/seed/orig${id}b/400/400`
    ],
    quantity: 1
  }
}

/** 创建订单 */
export async function createOrder(form: any): Promise<{ orderNo: string }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay(500, 1000)

  const orderNo = 'MC' + Date.now()
  return { orderNo }
}
