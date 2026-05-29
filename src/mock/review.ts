import type { Review } from '@/types/review'
import { mockDelay, mockPage, ENABLE_MOCK } from './index'

const userAvatar = (id: number) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=user${id}`

const reviewImg = (id: number) =>
  `https://picsum.photos/seed/rev${id}/300/300`

/** Mock 评价数据 */
const reviews: Review[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1
  const names = ['小明', '阿花', '大卫', '小红', '阿杰', '小美', '老王', '小李', '阿强', '小张']
  const contents = [
    '做工非常精细，还原度很高，下次还来！',
    '整体不错，交付速度也快，沟通很顺畅。',
    '第二次合作了，品质一如既往地好，强烈推荐！',
    '模型细节处理得很好，比预期效果还好。',
    '态度很好，反复修改都没有怨言，满意。',
    'Q版化效果很可爱，朋友都说好看。',
    '价格实惠，性价比高，会介绍朋友来。',
    '交付稍微晚了一天，但品质确实好。',
    '写实风格太赞了，完全还原了照片。',
    '沟通效率高，很快就理解了我的需求。'
  ]
  const modelerNames = ['张师傅', '李设计', '王工匠', '陈大师', '赵艺师', '刘工匠']

  return {
    id,
    orderId: id + 100,
    modelerId: (id % 6) + 1,
    modelerName: modelerNames[id % 6],
    modelerAvatar: userAvatar(id % 6 + 100),
    rating: [5, 4.5, 5, 4, 4.5, 5, 4.5, 4, 5, 4.5][id % 10],
    content: contents[id % 10],
    images: id % 3 === 0 ? [reviewImg(id * 2), reviewImg(id * 2 + 1)] : [],
    createTime: `2026-0${Math.floor((id % 5) + 1)}-${String((id % 28) + 1).padStart(2, '0')}`,
    replyContent: id % 4 === 0 ? '感谢您的好评，期待下次合作！' : undefined,
    replyTime: id % 4 === 0 ? `2026-0${Math.floor((id % 5) + 1)}-${String((id % 28) + 2).padStart(2, '0')}` : undefined,
    // 用 userName 存在 userInfo 里面，这里临时附加
    ...({ _userName: names[id % 10], _userAvatar: userAvatar(id) } as any)
  }
})

// ===== Mock API =====

/** 获取评价列表 */
export async function getReviewList(params: {
  modelerId?: number; pageNum: number; pageSize: number
}): Promise<{ list: Review[]; total: number }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  let filtered = [...reviews]
  if (params.modelerId) {
    filtered = filtered.filter(r => r.modelerId === params.modelerId)
  }

  return mockPage(filtered, params.pageNum, params.pageSize)
}

/** 创建评价 */
export async function createReview(form: any): Promise<{ id: number }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay(500, 1000)
  return { id: Date.now() }
}
