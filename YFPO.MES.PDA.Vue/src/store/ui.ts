/**
 * Pinia UI 态 —— 全局 loading / toast / 错误提示
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const loading = ref(false)
  const errMsg = ref('')
  const msg = ref('')

  function setLoading(b: boolean) {
    loading.value = b
  }
  function setErrMsg(m: string) {
    errMsg.value = m
  }
  function setMsg(m: string) {
    msg.value = m
  }

  return { loading, errMsg, msg, setLoading, setErrMsg, setMsg }
})
