import { useUserStore } from '@/stores/user'

/** 不需要登录的页面白名单 */
const WHITE_LIST = [
  'pages/index/index',
  'pages/modeler/detail',
  'pages/login/index',
  'pages/contact/index',
  'pages/webview/index'
]

/** 检查是否已登录 */
export function isLoggedIn(): boolean {
  const userStore = useUserStore()
  return userStore.isLoggedIn
}

/**
 * 路由守卫：需要登录的操作
 * @returns true 已登录可继续，false 未登录已跳转
 */
export function requireLogin(redirectBack?: boolean): boolean {
  if (isLoggedIn()) return true

  const currentPages = getCurrentPages()
  const currentPage = currentPages[currentPages.length - 1]
  const currentPath = currentPage?.route || ''

  // 存储当前页面路径，登录后回跳
  const redirectUrl = `/${currentPath}`
  uni.setStorageSync('mc_login_redirect', redirectUrl)

  uni.navigateTo({
    url: '/pages/login/index'
  })
  return false
}

/** 检查页面是否需要登录 */
export function checkPageAuth(pagePath: string): boolean {
  return WHITE_LIST.includes(pagePath)
}

/** 登录成功后跳转回原页面 */
export function navigateAfterLogin() {
  const redirectUrl = uni.getStorageSync('mc_login_redirect')
  if (redirectUrl) {
    uni.removeStorageSync('mc_login_redirect')
    uni.redirectTo({ url: redirectUrl })
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

/** H5 环境获取微信 OAuth code */
export function getH5OAuthCode(): string | null {
  // #ifdef H5
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get('code')
  } catch {
    return null
  }
  // #endif
  // #ifndef H5
  return null
  // #endif
}

/** 小程序环境获取微信登录 code */
export function getWxLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('获取微信code失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('非微信小程序环境'))
    // #endif
  })
}
