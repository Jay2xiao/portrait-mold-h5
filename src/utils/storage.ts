const STORAGE_PREFIX = 'mc_'

/** 设置存储（支持过期时间） */
export function setStorage(key: string, value: any, expireMinutes?: number) {
  const fullKey = STORAGE_PREFIX + key
  const data = {
    value,
    expire: expireMinutes ? Date.now() + expireMinutes * 60 * 1000 : 0
  }
  uni.setStorageSync(fullKey, JSON.stringify(data))
}

/** 获取存储 */
export function getStorage<T = any>(key: string): T | null {
  const fullKey = STORAGE_PREFIX + key
  const raw = uni.getStorageSync(fullKey)
  if (!raw) return null

  try {
    const data = JSON.parse(raw)
    if (data.expire && data.expire < Date.now()) {
      uni.removeStorageSync(fullKey)
      return null
    }
    return data.value
  } catch {
    return raw
  }
}

/** 移除存储 */
export function removeStorage(key: string) {
  uni.removeStorageSync(STORAGE_PREFIX + key)
}
