import type { Modeler, ModelerDetail, ModelerListQuery } from '@/types/modeler'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/modeler'
import { getPage, get } from '@/utils/request'

/** 获取建模师列表 */
export async function getModelerList(query: ModelerListQuery): Promise<{ list: Modeler[]; total: number }> {
  if (ENABLE_MOCK) {
    return mockApi.getModelerList(query)
  }
  return getPage<Modeler>('/api/c/modeler/list', query)
}

/** 获取建模师详情 */
export async function getModelerDetail(id: number): Promise<ModelerDetail> {
  if (ENABLE_MOCK) {
    const result = await mockApi.getModelerDetail(id)
    if (!result) throw new Error('建模师不存在')
    return result
  }
  return get<ModelerDetail>(`/api/c/modeler/${id}`)
}
