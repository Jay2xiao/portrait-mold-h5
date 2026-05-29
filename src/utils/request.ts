import { useUserStore } from '@/stores/user'

export const API_BASE_URL = 'http://localhost:8080'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
}

/** 通用 HTTP 请求封装 */
export function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()

    if (options.showLoading) {
      uni.showLoading({ title: '加载中...', mask: true })
    }

    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (userStore.token) {
      header['Authorization'] = `Bearer ${userStore.token}`
    }

    uni.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res: any) => {
        const data = res.data
        if (data.code === 200) {
          resolve(data.data !== undefined ? data.data : data.rows ? { rows: data.rows, total: data.total } : data)
        } else if (data.code === 401) {
          handleUnauthorized()
          reject(new Error('登录已过期'))
        } else {
          uni.showToast({ title: data.msg || '请求失败', icon: 'none' })
          reject(new Error(data.msg || '请求失败'))
        }
      },
      fail: (err: any) => {
        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (options.showLoading) {
          uni.hideLoading()
        }
      }
    })
  })
}

/** 处理 401 未授权 */
function handleUnauthorized() {
  const userStore = useUserStore()
  userStore.logout()
  uni.showModal({
    title: '提示',
    content: '登录已过期，请重新登录',
    showCancel: false,
    success: () => {
      uni.navigateTo({ url: '/pages/login/index' })
    }
  })
}

/** GET 请求 */
export function get<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'GET', data })
}

/** POST 请求 */
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'POST', data })
}

/** PUT 请求 */
export function put<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'PUT', data })
}

/** DELETE 请求 */
export function del<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'DELETE', data })
}

/** 分页查询请求 */
export function getPage<T = any>(url: string, data?: any): Promise<{ rows: T[]; total: number }> {
  return request({ url, method: 'GET', data }) as any
}

export default { request, get, post, put, del, getPage }
