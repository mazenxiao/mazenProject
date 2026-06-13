/**
 * Pinia 工厂列表态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FactoryItem } from '@/models/Base'
import { FACTORIES, LAST_FACTORY_KEY } from '@/services/factories'

export const useFactoriesStore = defineStore('factories', () => {
  const factories = ref<ReadonlyArray<FactoryItem>>(FACTORIES)
  const lastUseFactoryCode = ref<string>(
    localStorage.getItem(LAST_FACTORY_KEY) || FACTORIES[0]?.code || '',
  )

  function setLastUseFactoryCode(code: string) {
    lastUseFactoryCode.value = code
    localStorage.setItem(LAST_FACTORY_KEY, code)
  }

  return { factories, lastUseFactoryCode, setLastUseFactoryCode }
})
