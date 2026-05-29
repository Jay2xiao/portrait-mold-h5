import type { Review, CreateReviewForm } from '@/types/review'
import type { PageQuery } from '@/types/api'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/review'
import { getPage, post } from '@/utils/request'

/** 获取评价列表 */
export async function getReviewList(params: PageQuery & { modelerId?: number }): Promise<{ list: Review[]; total: number }> {
  if (ENABLE_MOCK) {
    return mockApi.getReviewList(params)
  }
  return getPage<Review>('/api/c/review/list', params)
}

/** 创建评价 */
export async function createReview(form: CreateReviewForm): Promise<{ id: number }> {
  if (ENABLE_MOCK) {
    return mockApi.createReview(form)
  }
  return post<{ id: number }>('/api/c/review', form)
}
