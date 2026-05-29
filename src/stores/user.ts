import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginResult } from '@/types/user'
import { h5Login, wxLogin, getUserInfo as fetchUserInfo } from '@/api/user'

const STORAGE_TOKEN = 'mc_token'
const STORAGE_USER = 'mc_user_info'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const hasPhone = computed(() => !!userInfo.value?.isPhoneBound)
  const displayName = computed(() => userInfo.value?.nickName || '用户')

  /** 从 Storage 恢复登录状态 */
  function checkLoginStatus() {
    const savedToken = uni.getStorageSync(STORAGE_TOKEN)
    const savedUser = uni.getStorageSync(STORAGE_USER)
    if (savedToken) {
      token.value = savedToken
      userInfo.value = savedUser ? JSON.parse(savedUser) : null
    }
  }

  /** 登录 */
  function login(result: LoginResult) {
    token.value = result.token
    userInfo.value = result.userInfo
    uni.setStorageSync(STORAGE_TOKEN, result.token)
    uni.setStorageSync(STORAGE_USER, JSON.stringify(result.userInfo))
  }

  /** 更新用户信息 */
  function updateUserInfo(data: Partial<UserInfo>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
      uni.setStorageSync(STORAGE_USER, JSON.stringify(userInfo.value))
    }
  }

  /** 退出登录 */
  function logout() {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync(STORAGE_TOKEN)
    uni.removeStorageSync(STORAGE_USER)
  }

  /** H5 静默登录 */
  async function h5SilentLogin(code: string) {
    try {
      const result = await h5Login(code)
      login(result)
    } catch (e) {
      console.warn('H5 silent login failed:', e)
    }
  }

  /** 小程序微信登录 */
  async function wxMpLogin(wxCode: string) {
    try {
      const result = await wxLogin(wxCode)
      login(result)
      return result
    } catch (e) {
      console.error('WX login failed:', e)
      throw e
    }
  }

  /** 刷新用户信息 */
  async function refreshUserInfo() {
    try {
      const info = await fetchUserInfo()
      userInfo.value = info
      uni.setStorageSync(STORAGE_USER, JSON.stringify(info))
    } catch (e) {
      console.warn('Refresh user info failed:', e)
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    hasPhone,
    displayName,
    checkLoginStatus,
    login,
    logout,
    updateUserInfo,
    h5SilentLogin,
    wxMpLogin,
    refreshUserInfo
  }
})
