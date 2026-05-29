import type { PageQuery } from './api'

/** 收藏的建模师信息 */
export interface FavoriteModeler {
  id: number
  name: string
  avatar: string
  title: string
  rating: number
  orderCount: number
  tags: string[]
  priceRange: string
  isOnline: boolean
  collectedAt: string
}

/** 收藏列表查询参数 */
export interface FavoriteListQuery extends PageQuery {
  keyword?: string
}
