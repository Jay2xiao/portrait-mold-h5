import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelerStore = defineStore('modeler', () => {
  const categoryList = ref(['全部', '人物模型', 'Q版模型', '场景建模', '修模服务'])
  const lastSearchKeyword = ref('')
  const lastFilterTag = ref('')

  function setSearchState(keyword: string, tag: string) {
    lastSearchKeyword.value = keyword
    lastFilterTag.value = tag
  }

  function clearSearchState() {
    lastSearchKeyword.value = ''
    lastFilterTag.value = ''
  }

  return {
    categoryList,
    lastSearchKeyword,
    lastFilterTag,
    setSearchState,
    clearSearchState
  }
})
