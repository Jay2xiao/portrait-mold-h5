/**
 * 图片预览组合式函数
 */
export function useImagePreview() {
  /**
   * 预览图片
   * @param urls 图片URL列表
   * @param current 当前显示的图片URL或索引
   */
  function preview(urls: string[], current?: string | number) {
    if (!urls.length) return

    const currentIndex = typeof current === 'string'
      ? urls.indexOf(current)
      : (current ?? 0)

    uni.previewImage({
      urls,
      current: Math.max(0, currentIndex)
    })
  }

  return { preview }
}
