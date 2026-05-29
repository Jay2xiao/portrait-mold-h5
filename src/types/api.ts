/** API 通用响应 - 对齐 RuoYi-Vue-Plus */
export interface R<T = any> {
  code: number
  msg: string
  data: T
}

/** 分页响应 - 对齐 RuoYi-Vue-Plus */
export interface TableDataInfo<T = any> {
  code: number
  msg: string
  rows: T[]
  total: number
}

/** 分页请求参数 */
export interface PageQuery {
  pageNum: number
  pageSize: number
}
