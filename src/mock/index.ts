/** Mock 全局开关和辅助函数 */

/** 是否启用 Mock 数据（联调时改为 false） */
export const ENABLE_MOCK = true

/** 模拟网络延迟 */
export function mockDelay(min = 200, max = 500): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

/** 构造成功的 Mock 响应 */
export function mockSuccess<T>(data: T): T {
  return data
}

/** 构造分页的 Mock 响应 */
export function mockPage<T>(
  list: T[],
  pageNum: number,
  pageSize: number
): { list: T[]; total: number } {
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  return {
    list: list.slice(start, end),
    total: list.length
  }
}
