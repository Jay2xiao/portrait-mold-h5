import { post } from '@/utils/request'

export interface WxBindCompleteParams {
  token: string
  code: string
}

export function completeWxUserBind(data: WxBindCompleteParams): Promise<void> {
  return post('/wx/mp/user-bind/complete', data)
}
