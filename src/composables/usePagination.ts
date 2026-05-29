import { ref, type Ref } from 'vue'
import type { PageQuery } from '@/types/api'

interface UsePaginationOptions<T, P = {}> {
  fetchFn: (params: PageQuery & P) => Promise<{ list: T[]; total: number }>
  defaultPageSize?: number
  immediate?: boolean
}

interface UsePaginationReturn<T> {
  list: Ref<T[]>
  loading: Ref<boolean>
  loadingMore: Ref<boolean>
  noMore: Ref<boolean>
  total: Ref<number>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  resetList: () => void
}

/**
 * 分页加载组合式函数
 * 用于首页建模师列表、订单列表、评价列表等需要分页的场景
 */
export function usePagination<T, P = {}>(
  options: UsePaginationOptions<T, P>
): UsePaginationReturn<T> {
  const { fetchFn, defaultPageSize = 10, immediate = false } = options

  const list = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const loadingMore = ref(false)
  const noMore = ref(false)
  const total = ref(0)

  let pageNum = 1
  let pageSize = defaultPageSize
  let extraParams = {} as P

  /** 设置额外查询参数 */
  function setParams(params: P) {
    extraParams = params
  }

  /** 重置并重新加载 */
  async function refresh() {
    pageNum = 1
    noMore.value = false
    loading.value = true
    try {
      const result = await fetchFn({
        pageNum,
        pageSize,
        ...extraParams
      })
      list.value = result.list
      total.value = result.total
      if (list.value.length >= result.total) {
        noMore.value = true
      }
    } catch (e) {
      console.error('Pagination refresh failed:', e)
    } finally {
      loading.value = false
    }
  }

  /** 加载下一页 */
  async function loadMore() {
    if (noMore.value || loadingMore.value) return

    loadingMore.value = true
    pageNum++
    try {
      const result = await fetchFn({
        pageNum,
        pageSize,
        ...extraParams
      })
      list.value = [...list.value, ...result.list]
      total.value = result.total
      if (list.value.length >= result.total) {
        noMore.value = true
      }
    } catch (e) {
      pageNum-- // 加载失败回退页码
      console.error('Pagination loadMore failed:', e)
    } finally {
      loadingMore.value = false
    }
  }

  /** 清空列表 */
  function resetList() {
    list.value = []
    total.value = 0
    pageNum = 1
    noMore.value = false
  }

  if (immediate) {
    refresh()
  }

  return {
    list,
    loading,
    loadingMore,
    noMore,
    total,
    refresh,
    loadMore,
    resetList,
    // @ts-ignore - 暴露给外部设置参数
    setParams
  } as UsePaginationReturn<T> & { setParams: (params: P) => void }
}
