import type { UserInfo, LoginResult } from '@/types/user'
import { mockDelay, ENABLE_MOCK } from './index'

/** Mock 用户数据 */
const mockUser: UserInfo = {
  id: 1,
  nickName: '模友小明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser',
  phone: '13812348000',
  isPhoneBound: true
}

// ===== Mock API =====

/** H5 静默登录 */
export async function h5Login(_code: string): Promise<LoginResult> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return {
    token: 'mock_h5_token_' + Date.now(),
    userInfo: { ...mockUser },
    isNewUser: false
  }
}

/** 微信小程序登录 */
export async function wxLogin(_code: string): Promise<LoginResult> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return {
    token: 'mock_wx_token_' + Date.now(),
    userInfo: { ...mockUser },
    isNewUser: false
  }
}

/** 获取用户信息 */
export async function getUserInfo(): Promise<UserInfo> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return { ...mockUser }
}

/** 绑定手机号（微信快捷） */
export async function bindPhone(_code: string): Promise<{ phone: string }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return { phone: '13812348000' }
}

/** 绑定手机号（短信验证码） */
export async function bindPhoneBySms(_phone: string, _smsCode: string): Promise<{ phone: string }> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return { phone: _phone }
}

/** 发送短信验证码 */
export async function sendSmsCode(_phone: string): Promise<void> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
}

/** 更新用户信息 */
export async function updateUserInfo(_data: Partial<UserInfo>): Promise<UserInfo> {
  if (!ENABLE_MOCK) throw new Error('Mock disabled')
  await mockDelay()
  return { ...mockUser, ..._data }
}
