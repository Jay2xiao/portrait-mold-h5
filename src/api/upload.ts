import { post } from '@/utils/request'
import { ENABLE_MOCK, mockDelay } from '@/mock'

/** 上传图片 */
export async function uploadImage(filePath: string): Promise<string> {
  if (ENABLE_MOCK) {
    await mockDelay(500, 1500)
    // Mock 返回一个占位图片URL
    return `https://picsum.photos/seed/upload${Date.now()}/400/400`
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'http://localhost:8080/api/c/upload/image',
      filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 200) {
          resolve(data.data)
        } else {
          reject(new Error(data.msg || '上传失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
