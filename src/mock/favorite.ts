import type { FavoriteModeler } from '@/types/favorite'
import { mockDelay, mockPage, ENABLE_MOCK } from './index'
import { findModelerById, getAllModelers } from './modeler'

/** 收藏列表（可变数组，支持增删） */
let favorites: FavoriteModeler[] = [
  buildFavorite(1, '2026-05-20 14:30:00'),
  buildFavorite(3, '2026-05-18 09:15:00'),
  buildFavorite(5, '2026-05-15 16:40:00'),
  buildFavorite(8, '2026-05-10 11:20:00')
].filter(Boolean) as FavoriteModeler[]

function buildFavorite(modelerId: number, collectedAt: string): FavoriteModeler | null {
  const m = findModelerById(modelerId)
  if (!m) return null
  return {
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    title: m.title,
    rating: m.rating,
    orderCount: m.orderCount,
    tags: m.tags,
    priceRange: m.priceRange,
    isOnline: m.isOnline,
    collectedAt
  }
}

/** 获取收藏列表 */
export async function getFavoriteList(params: {
  pageNum: number; pageSize: number; keyword?: string
}): Promise<{ list: FavoriteModeler[]; total: number }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  let filtered = [...favorites]
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(kw) ||
      f.tags.some(t => t.toLowerCase().includes(kw))
    )
  }

  // 按收藏时间倒序
  filtered.sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())

  return mockPage(filtered, params.pageNum, params.pageSize)
}

/** 添加收藏 */
export async function addFavorite(modelerId: number): Promise<void> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()

  if (favorites.some(f => f.id === modelerId)) return

  const m = findModelerById(modelerId)
  if (!m) throw new Error('建模师不存在')

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const collectedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  favorites.unshift({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    title: m.title,
    rating: m.rating,
    orderCount: m.orderCount,
    tags: m.tags,
    priceRange: m.priceRange,
    isOnline: m.isOnline,
    collectedAt
  })
}

/** 取消收藏 */
export async function removeFavorite(modelerId: number): Promise<void> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  favorites = favorites.filter(f => f.id !== modelerId)
}

/** 检查是否已收藏 */
export async function checkFavorite(modelerId: number): Promise<boolean> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay(50, 100)
  return favorites.some(f => f.id === modelerId)
}

/** 获取所有收藏的建模师 ID 列表 */
export async function getFavoriteIds(): Promise<number[]> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay(50, 100)
  return favorites.map(f => f.id)
}
