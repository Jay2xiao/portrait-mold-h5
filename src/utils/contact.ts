/** 企业微信客服配置 */
const ENTERPRISE_WECHAT_CORP_ID = '' // TODO: 填入企业微信企业ID
const ENTERPRISE_WECHAT_KF_URL = '' // TODO: 填入企微客服链接 https://work.weixin.qq.com/kfid/xxx
const CUSTOMER_SERVICE_WECHAT_ID = '' // TODO: 填入客服微信号
const CUSTOMER_SERVICE_QRCODE_URL = '' // TODO: 填入客服二维码图片URL

/**
 * 联系修模师 - 多平台差异化跳转
 */
export function contactModeler(modelerName?: string) {
  // #ifdef MP-WEIXIN
  // 微信小程序：调用企微客服
  contactViaWeChatMp()
  // #endif

  // #ifdef H5
  // H5：跳转 webview 加载企微客服链接
  contactViaH5()
  // #endif

  // #ifdef MP-DOUYIN
  // 抖音小程序：复制微信号
  copyWeChatId()
  // #endif
}

/** 微信小程序：调用企微客服 */
function contactViaWeChatMp() {
  if (!ENTERPRISE_WECHAT_KF_URL) {
    copyWeChatId()
    return
  }

  // @ts-ignore
  wx.openCustomerServiceChat({
    corpId: ENTERPRISE_WECHAT_CORP_ID,
    url: ENTERPRISE_WECHAT_KF_URL,
    fail: () => {
      // 失败 fallback：复制微信号
      copyWeChatId()
    }
  })
}

/** H5：跳转 webview 页面 */
function contactViaH5() {
  if (ENTERPRISE_WECHAT_KF_URL) {
    uni.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(ENTERPRISE_WECHAT_KF_URL)}`
    })
  } else {
    copyWeChatId()
  }
}

/** 复制客服微信号 */
function copyWeChatId() {
  if (!CUSTOMER_SERVICE_WECHAT_ID) {
    uni.showToast({ title: '客服微信号暂未配置', icon: 'none' })
    return
  }

  uni.setClipboardData({
    data: CUSTOMER_SERVICE_WECHAT_ID,
    success: () => {
      uni.showToast({ title: '微信号已复制，请添加好友', icon: 'none', duration: 2500 })
    }
  })
}

export {
  ENTERPRISE_WECHAT_CORP_ID,
  ENTERPRISE_WECHAT_KF_URL,
  CUSTOMER_SERVICE_WECHAT_ID,
  CUSTOMER_SERVICE_QRCODE_URL
}
