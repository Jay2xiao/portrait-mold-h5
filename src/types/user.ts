/** 用户信息 */
export interface UserInfo {
  id: number
  nickName: string
  avatar: string
  phone: string
  isPhoneBound: boolean
}

/** 登录结果 */
export interface LoginResult {
  token: string
  userInfo: UserInfo
  isNewUser: boolean
}
