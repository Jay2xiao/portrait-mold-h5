import type { UserInfo, LoginResult } from '@/types/user'
import { ENABLE_MOCK } from '@/mock'
import * as mockApi from '@/mock/user'
import { get, post, put } from '@/utils/request'

/** H5 静默登录 */
export async function h5Login(code: string): Promise<LoginResult> {
  if (ENABLE_MOCK) {
    return mockApi.h5Login(code)
  }
  return post<LoginResult>('/api/c/h5/login', { code })
}

/** 微信小程序登录 */
export async function wxLogin(code: string): Promise<LoginResult> {
  if (ENABLE_MOCK) {
    return mockApi.wxLogin(code)
  }
  return post<LoginResult>('/api/c/wx/login', { code })
}

/** 获取用户信息 */
export async function getUserInfo(): Promise<UserInfo> {
  if (ENABLE_MOCK) {
    return mockApi.getUserInfo()
  }
  return get<UserInfo>('/api/c/user/info')
}

/** 绑定手机号（微信快捷） */
export async function bindPhone(code: string): Promise<{ phone: string }> {
  if (ENABLE_MOCK) {
    return mockApi.bindPhone(code)
  }
  return post<{ phone: string }>('/api/c/user/bindPhone', { code })
}

/** 绑定手机号（短信验证码） */
export async function bindPhoneBySms(phone: string, smsCode: string): Promise<{ phone: string }> {
  if (ENABLE_MOCK) {
    return mockApi.bindPhoneBySms(phone, smsCode)
  }
  return post<{ phone: string }>('/api/c/user/bindPhone/sms', { phone, smsCode })
}

/** 发送短信验证码 */
export async function sendSmsCode(phone: string): Promise<void> {
  if (ENABLE_MOCK) {
    return mockApi.sendSmsCode(phone)
  }
  return post('/api/c/sms/send', { phone })
}

/** 更新用户信息 */
export async function updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
  if (ENABLE_MOCK) {
    return mockApi.updateUserInfo(data)
  }
  return put<UserInfo>('/api/c/user/info', data)
}
