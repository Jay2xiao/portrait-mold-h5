import { get, post } from '@/utils/request'

export interface WxBindCompleteParams {
  token: string
  code: string
}

export function completeWxUserBind(data: WxBindCompleteParams): Promise<void> {
  return post('/wx/mp/user-bind/complete', data)
}

export interface WxNotificationMedia {
  name?: string
  url: string
  type?: string
}

export interface WxNotificationField {
  label: string
  value: string
}

export interface WxNotificationDetail {
  id: number
  title?: string
  content?: string
  noticeType?: string
  priority?: string
  bizType?: string
  bizId?: number
  bizNo?: string
  jumpUrl?: string
  redirectUrl?: string
  createTime?: string
  fields?: WxNotificationField[]
  images?: WxNotificationMedia[]
  attachments?: WxNotificationMedia[]
}

export function getWxNotificationDetail(id: string | number, code: string): Promise<WxNotificationDetail> {
  return get('/wx/mp/notification/detail', { id, code })
}
