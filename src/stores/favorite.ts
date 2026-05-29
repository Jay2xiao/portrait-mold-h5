import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addFavorite, removeFavorite, getFavoriteIds } from '@/api/favorite'

export const useFavoriteStore = defineStore('favorite', () => {
  /** 收藏 ID 集合（Set 实现 O(1) 查询） */
  const favoriteIds = ref<Set<number>>(new Set())
  const initialized = ref(false)

  /** 收藏数量 */
  const favoriteCount = computed(() => favoriteIds.value.size)

  /** 加载所有收藏 ID */
  async function loadFavoriteIds() {
    if (initialized.value) return
    try {
      const ids = await getFavoriteIds()
      favoriteIds.value = new Set(ids)
      initialized.value = true
    } catch (e) {
      console.warn('Load favorite ids failed:', e)
    }
  }

  /** 检查是否已收藏 */
  function isFavorite(modelerId: number): boolean {
    return favoriteIds.value.has(modelerId)
  }

  /** 切换收藏状态 */
  async function toggleFavorite(modelerId: number) {
    const wasFavorited = favoriteIds.value.has(modelerId)
    try {
      if (wasFavorited) {
        await removeFavorite(modelerId)
        favoriteIds.value.delete(modelerId)
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      } else {
        await addFavorite(modelerId)
        favoriteIds.value.add(modelerId)
        uni.showToast({ title: '已收藏', icon: 'none' })
      }
      // 触发响应式更新
      favoriteIds.value = new Set(favoriteIds.value)
    } catch (e) {
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  /** 重置收藏缓存（退出登录时调用） */
  function resetFavorites() {
    favoriteIds.value = new Set()
    initialized.value = false
  }

  return {
    favoriteIds,
    initialized,
    favoriteCount,
    loadFavoriteIds,
    isFavorite,
    toggleFavorite,
    resetFavorites
  }
})
