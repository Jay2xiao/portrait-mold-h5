/** 建模师基础信息 */
export interface Modeler {
  id: number
  name: string
  avatar: string
  title: string
  rating: number
  orderCount: number
  tags: string[]
  priceRange: string
  priceMin: number
  deliveryDays: string
  description: string
  isOnline: boolean
  experience: number
}

/** 建模师详情（含作品、价格、评价） */
export interface ModelerDetail extends Modeler {
  works: Work[]
  priceList: PriceItem[]
  reviews: ReviewPreview[]
  reviewStats: {
    total: number
    avgRating: number
  }
}

/** 作品 */
export interface Work {
  id: number
  imageUrl: string
  title: string
  type: string
}

/** 服务价格项 */
export interface PriceItem {
  id: number
  serviceName: string
  price: number
  deliveryDays: number
  description?: string
}

/** 建模师列表查询参数 */
export interface ModelerListQuery {
  tag?: string
  sort?: string
  keyword?: string
  pageNum: number
  pageSize: number
}
