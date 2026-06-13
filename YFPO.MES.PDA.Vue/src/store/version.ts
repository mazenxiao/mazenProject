/**
 * Pinia 版本态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVersionStore = defineStore('version', () => {
  const current = ref<string>(
    typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev',
  )
  const latest = ref<string>(current.value)
  const buildTime = ref<string | undefined>(undefined)
  const hasNew = ref(false)

  return { current, latest, buildTime, hasNew }
})
