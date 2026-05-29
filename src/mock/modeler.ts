import type { Modeler, ModelerDetail, Work, PriceItem } from '@/types/modeler'
import { mockDelay, mockPage, ENABLE_MOCK } from './index'

/** 作品图片使用 placeholder */
const IMG = (id: number, w = 400, h = 300) =>
  `https://picsum.photos/seed/mc${id}/${w}/${h}`

const avatarImg = (id: number) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=modeler${id}`

/** Mock 建模师数据 */
const modelers: Modeler[] = [
  {
    id: 1, name: '张师傅', avatar: avatarImg(1), title: '资深3D建模师',
    rating: 4.9, orderCount: 326, tags: ['人物模型', 'Q版模型', '写实风格'],
    priceRange: '50-500', priceMin: 50, deliveryDays: '3-7',
    description: '10年3D建模经验，擅长人物手办和Q版角色建模，作品精细度高，还原度好。',
    isOnline: true, experience: 10
  },
  {
    id: 2, name: '李设计', avatar: avatarImg(2), title: '高级建模师',
    rating: 4.8, orderCount: 258, tags: ['Q版模型', '卡通角色', '动漫手办'],
    priceRange: '80-600', priceMin: 80, deliveryDays: '3-5',
    description: '专注于Q版和卡通风格建模，色彩搭配出色，深受动漫爱好者好评。',
    isOnline: true, experience: 7
  },
  {
    id: 3, name: '王工匠', avatar: avatarImg(3), title: '首席建模师',
    rating: 4.95, orderCount: 189, tags: ['人物模型', '场景建模', '写实风格'],
    priceRange: '100-800', priceMin: 100, deliveryDays: '5-10',
    description: '擅长高精度写实人物和复杂场景建模，追求极致细节。',
    isOnline: false, experience: 12
  },
  {
    id: 4, name: '陈大师', avatar: avatarImg(4), title: '特级建模师',
    rating: 4.7, orderCount: 412, tags: ['人物模型', '机甲模型', '游戏角色'],
    priceRange: '60-450', priceMin: 60, deliveryDays: '2-5',
    description: '游戏行业出身，机甲和角色建模效率高，性价比优秀。',
    isOnline: true, experience: 8
  },
  {
    id: 5, name: '赵艺师', avatar: avatarImg(5), title: '创意建模师',
    rating: 4.85, orderCount: 156, tags: ['Q版模型', '宠物模型', '创意定制'],
    priceRange: '40-350', priceMin: 40, deliveryDays: '2-4',
    description: '创意十足，擅长宠物Q版化和创意手办设计，作品充满趣味性。',
    isOnline: true, experience: 5
  },
  {
    id: 6, name: '刘工匠', avatar: avatarImg(6), title: '资深修模师',
    rating: 4.6, orderCount: 523, tags: ['修模服务', '模型修复', '上色服务'],
    priceRange: '30-200', priceMin: 30, deliveryDays: '1-3',
    description: '专业修模师，修复速度快，支持各类3D打印模型的后期处理。',
    isOnline: false, experience: 6
  },
  {
    id: 7, name: '周师傅', avatar: avatarImg(7), title: '场景建模专家',
    rating: 4.75, orderCount: 98, tags: ['场景建模', '建筑模型', '微缩景观'],
    priceRange: '200-1500', priceMin: 200, deliveryDays: '7-15',
    description: '场景建模领域深耕，擅长建筑微缩模型和影视场景还原。',
    isOnline: true, experience: 9
  },
  {
    id: 8, name: '吴艺人', avatar: avatarImg(8), title: '手办建模师',
    rating: 4.65, orderCount: 287, tags: ['人物模型', '动漫手办', '影视角色'],
    priceRange: '70-550', priceMin: 70, deliveryDays: '3-7',
    description: '动漫迷一枚，对角色还原度要求极高，每款作品都精雕细琢。',
    isOnline: true, experience: 6
  },
  {
    id: 9, name: '孙大师', avatar: avatarImg(9), title: '机甲建模师',
    rating: 4.8, orderCount: 134, tags: ['机甲模型', '科幻模型', '武器道具'],
    priceRange: '100-700', priceMin: 100, deliveryDays: '5-10',
    description: '机甲控，对机械结构理解深刻，作品硬核且细节丰富。',
    isOnline: false, experience: 8
  },
  {
    id: 10, name: '杨师傅', avatar: avatarImg(10), title: '全能建模师',
    rating: 4.55, orderCount: 367, tags: ['人物模型', 'Q版模型', '修模服务'],
    priceRange: '40-400', priceMin: 40, deliveryDays: '2-6',
    description: '全能型选手，各类风格都能驾驭，服务态度好，沟通顺畅。',
    isOnline: true, experience: 5
  },
  {
    id: 11, name: '黄工匠', avatar: avatarImg(11), title: '精品建模师',
    rating: 4.9, orderCount: 78, tags: ['人物模型', '写实风格', '肖像定制'],
    priceRange: '150-1000', priceMin: 150, deliveryDays: '7-14',
    description: '追求艺术品级别的建模品质，每件作品都是独一无二的精品。',
    isOnline: false, experience: 11
  },
  {
    id: 12, name: '林师傅', avatar: avatarImg(12), title: '快速建模师',
    rating: 4.5, orderCount: 445, tags: ['Q版模型', '快速出模', '批量定制'],
    priceRange: '30-250', priceMin: 30, deliveryDays: '1-3',
    description: '出模速度快，适合批量定制和紧急需求，品质稳定可靠。',
    isOnline: true, experience: 4
  }
]

/** 为每个建模师生成作品数据 */
function getWorksForModeler(modelerId: number): Work[] {
  const worksMap: Record<number, Work[]> = {
    1: [
      { id: 101, imageUrl: IMG(101), title: '古风侠客', type: '人物模型' },
      { id: 102, imageUrl: IMG(102), title: 'Q版悟空', type: 'Q版模型' },
      { id: 103, imageUrl: IMG(103), title: '机甲战士', type: '写实风格' },
      { id: 104, imageUrl: IMG(104), title: '仙女角色', type: '人物模型' },
      { id: 105, imageUrl: IMG(105), title: 'Q版皮卡丘', type: 'Q版模型' },
      { id: 106, imageUrl: IMG(106), title: '武士铠甲', type: '写实风格' }
    ],
    2: [
      { id: 201, imageUrl: IMG(201), title: 'Q版鸣人', type: 'Q版模型' },
      { id: 202, imageUrl: IMG(202), title: '卡通猫咪', type: '卡通角色' },
      { id: 203, imageUrl: IMG(203), title: 'Q版路飞', type: 'Q版模型' },
      { id: 204, imageUrl: IMG(204), title: '动漫少女', type: '动漫手办' }
    ]
  }
  return worksMap[modelerId] || [
    { id: modelerId * 100 + 1, imageUrl: IMG(modelerId * 100 + 1), title: '作品一', type: '人物模型' },
    { id: modelerId * 100 + 2, imageUrl: IMG(modelerId * 100 + 2), title: '作品二', type: 'Q版模型' },
    { id: modelerId * 100 + 3, imageUrl: IMG(modelerId * 100 + 3), title: '作品三', type: '写实风格' }
  ]
}

/** 为每个建模师生成价格数据 */
function getPriceForModeler(modelerId: number): PriceItem[] {
  const m = modelers.find(x => x.id === modelerId)
  if (!m) return []
  return [
    { id: 1, serviceName: '人物模型(简单)', price: m.priceMin, deliveryDays: parseInt(m.deliveryDays), description: '基础款人物手办' },
    { id: 2, serviceName: '人物模型(精细)', price: Math.round(m.priceMin * 2.5), deliveryDays: parseInt(m.deliveryDays) + 2, description: '高精度人物建模' },
    { id: 3, serviceName: 'Q版模型', price: Math.round(m.priceMin * 1.5), deliveryDays: parseInt(m.deliveryDays) - 1, description: 'Q版卡通化设计' },
    { id: 4, serviceName: '场景建模', price: Math.round(m.priceMin * 5), deliveryDays: parseInt(m.deliveryDays) + 5, description: '复杂场景搭建' },
    { id: 5, serviceName: '模型修复', price: Math.round(m.priceMin * 0.6), deliveryDays: Math.max(1, parseInt(m.deliveryDays) - 2), description: '已有模型的修复服务' }
  ]
}

// ===== Mock API =====

/** 根据 ID 查找建模师（供其他 mock 模块引用） */
export function findModelerById(id: number): Modeler | undefined {
  return modelers.find(m => m.id === id)
}

/** 获取所有建模师（供其他 mock 模块引用） */
export function getAllModelers(): Modeler[] {
  return modelers
}

/** 获取建模师列表 */
export async function getModelerList(params: {
  tag?: string; sort?: string; keyword?: string; pageNum: number; pageSize: number
}): Promise<{ list: Modeler[]; total: number }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  let filtered = [...modelers]

  // 标签筛选
  if (params.tag && params.tag !== '全部') {
    filtered = filtered.filter(m => m.tags.includes(params.tag!))
  }

  // 关键词搜索
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(kw) ||
      m.tags.some(t => t.toLowerCase().includes(kw)) ||
      m.description.toLowerCase().includes(kw)
    )
  }

  // 排序
  switch (params.sort) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'orders':
      filtered.sort((a, b) => b.orderCount - a.orderCount)
      break
    case 'price-low':
      filtered.sort((a, b) => a.priceMin - b.priceMin)
      break
    default:
      // 综合排序：在线优先 + 评分权重
      filtered.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1
        return (b.rating * 0.6 + b.orderCount * 0.004) - (a.rating * 0.6 + a.orderCount * 0.004)
      })
  }

  return mockPage(filtered, params.pageNum, params.pageSize)
}

/** 获取建模师详情 */
export async function getModelerDetail(id: number): Promise<ModelerDetail | null> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  const modeler = modelers.find(m => m.id === id)
  if (!modeler) return null

  return {
    ...modeler,
    works: getWorksForModeler(id),
    priceList: getPriceForModeler(id),
    reviews: [
      { id: 1, rating: 5, content: '做工非常精细，还原度很高，下次还来！', createTime: '2026-05-10', userName: '小明', userAvatar: '' },
      { id: 2, rating: 4.5, content: '整体不错，交付速度也快，沟通很顺畅。', createTime: '2026-04-28', userName: '阿花', userAvatar: '' },
      { id: 3, rating: 5, content: '第二次合作了，品质一如既往地好，强烈推荐！', createTime: '2026-04-15', userName: '大卫', userAvatar: '' }
    ],
    reviewStats: { total: 28, avgRating: modeler.rating }
  }
}
