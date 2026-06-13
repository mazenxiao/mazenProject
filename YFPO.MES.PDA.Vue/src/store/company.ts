/**
 * Pinia 公司/工厂态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Company, Factory, ScanSiteInfo } from '@/models'

const COMPANY_KEY = 'mes-pda.company'
const FACTORY_KEY = 'mes-pda.factory'

export const useCompanyStore = defineStore('company', () => {
  const company = ref<Company | null>(load(COMPANY_KEY))
  const factory = ref<Factory | null>(load(FACTORY_KEY))
  const scanSiteInfo = ref<ScanSiteInfo | null>(null)

  function setCompany(c: Company | null) {
    company.value = c
    save(COMPANY_KEY, c)
  }

  function setFactory(f: Factory | null) {
    factory.value = f
    save(FACTORY_KEY, f)
  }

  function setScanSiteInfo(s: ScanSiteInfo | null) {
    scanSiteInfo.value = s
  }

  return {
    company,
    factory,
    scanSiteInfo,
    setCompany,
    setFactory,
    setScanSiteInfo,
  }
})

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function save<T>(key: string, val: T | null) {
  if (val) localStorage.setItem(key, JSON.stringify(val))
  else localStorage.removeItem(key)
}
