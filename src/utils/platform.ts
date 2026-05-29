/** 判断当前是否为 H5 环境 */
export function isH5(): boolean {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/** 判断当前是否为微信小程序环境 */
export function isWeChatMp(): boolean {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

/** 判断当前是否为抖音小程序环境 */
export function isDouyinMp(): boolean {
  // #ifdef MP-DOUYIN
  return true
  // #endif
  // #ifndef MP-DOUYIN
  return false
  // #endif
}

/** 获取当前平台标识 */
export function getPlatform(): 'h5' | 'mp-weixin' | 'mp-douyin' | 'unknown' {
  // #ifdef H5
  return 'h5'
  // #endif
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  // #ifdef MP-DOUYIN
  return 'mp-douyin'
  // #endif
  return 'unknown'
}
