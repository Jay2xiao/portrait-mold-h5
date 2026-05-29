/** 评价详情 */
export interface Review {
  id: number
  orderId: number
  modelerId: number
  modelerName: string
  modelerAvatar: string
  rating: number
  content: string
  images: string[]
  createTime: string
  replyContent?: string
  replyTime?: string
}

/** 评价预览（用于建模师详情页精简展示） */
export interface ReviewPreview {
  id: number
  rating: number
  content: string
  createTime: string
  userName: string
  userAvatar: string
}

/** 创建评价表单 */
export interface CreateReviewForm {
  orderId: number
  rating: number
  content: string
  images: string[]
}
