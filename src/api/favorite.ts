import type { FavoriteModeler } from '@/types/favorite'
import type { PageQuery } from '@/types/api'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/favorite'
import { getPage, get, post, del } from '@/utils/request'

/** 获取收藏列表 */
export async function getFavoriteList(
  params: PageQuery & { keyword?: string }
): Promise<{ list: FavoriteModeler[]; total: number }> {
  if (ENABLE_MOCK) {
    return mockApi.getFavoriteList(params)
  }
  return getPage<FavoriteModeler>('/api/c/favorite/list', params)
}

/** 添加收藏 */
export async function addFavorite(modelerId: number): Promise<void> {
  if (ENABLE_MOCK) {
    return mockApi.addFavorite(modelerId)
  }
  await post('/api/c/favorite', { modelerId })
}

/** 取消收藏 */
export async function removeFavorite(modelerId: number): Promise<void> {
  if (ENABLE_MOCK) {
    return mockApi.removeFavorite(modelerId)
  }
  await del(`/api/c/favorite/${modelerId}`)
}

/** 检查是否已收藏 */
export async function checkFavorite(modelerId: number): Promise<boolean> {
  if (ENABLE_MOCK) {
    return mockApi.checkFavorite(modelerId)
  }
  return get<boolean>(`/api/c/favorite/check/${modelerId}`)
}

/** 获取所有收藏的建模师 ID */
export async function getFavoriteIds(): Promise<number[]> {
  if (ENABLE_MOCK) {
    return mockApi.getFavoriteIds()
  }
  return get<number[]>('/api/c/favorite/ids')
}
