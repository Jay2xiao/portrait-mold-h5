<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

onLaunch(() => {
  console.log('App Launch')
  const appStore = useAppStore()
  appStore.init()

  const userStore = useUserStore()
  userStore.checkLoginStatus()

  // H5 静默登录：解析 URL 中的微信 OAuth code
  // #ifdef H5
  handleH5SilentLogin()
  // #endif
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

function handleH5SilentLogin() {
  try {
    const url = new URL(window.location.href)
    if (url.hash.includes('/pages/wx-bind/index') || url.hash.includes('/pages/notify/detail')) {
      return
    }
    const code = url.searchParams.get('code')
    if (code) {
      const userStore = useUserStore()
      if (!userStore.token) {
        // 有 code 且未登录，调用 H5 登录接口
        userStore.h5SilentLogin(code)
      }
      // 清除 URL 中的 code 参数，避免刷新重复使用
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      window.history.replaceState({}, '', url.toString())
    }
  } catch (e) {
    console.warn('H5 silent login parse failed:', e)
  }
}
</script>

<style lang="scss">
@import '@/styles/theme.scss';
@import '@/styles/common.scss';
@import '@/styles/iconfont.scss';

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: var(--color-text-primary);
  background-color: var(--color-bg-page);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

view,
text,
scroll-view,
swiper {
  box-sizing: border-box;
}

image {
  display: block;
}
</style>
