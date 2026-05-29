import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref<UniApp.GetSystemInfoResult | null>(null)
  const statusBarHeight = ref(0)
  const safeAreaBottom = ref(0)
  const isReady = ref(false)

  /** 初始化应用信息 */
  function init() {
    try {
      const info = uni.getSystemInfoSync()
      systemInfo.value = info
      statusBarHeight.value = info.statusBarHeight || 0

      // 计算底部安全区
      if (info.safeArea) {
        safeAreaBottom.value = info.screenHeight - info.safeArea.bottom
      }

      isReady.value = true
    } catch (e) {
      console.warn('Get system info failed:', e)
    }
  }

  return {
    systemInfo,
    statusBarHeight,
    safeAreaBottom,
    isReady,
    init
  }
})
