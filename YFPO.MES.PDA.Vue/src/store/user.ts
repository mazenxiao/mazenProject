/**
 * Pinia 用户态
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/models'
import { getMachineId } from '@/plugins/device'

const USER_KEY = 'mes-pda.user'
const LANG_KEY = 'mes-pda.lang'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(loadUser())
  const lang = ref<string>(
    localStorage.getItem(LANG_KEY) ||
      import.meta.env.VITE_DEFAULT_LANG ||
      'zh-CN',
  )
  const privs = ref<string[]>([])
  const machineId = ref<string>(getMachineId())

  const isLoggedIn = computed(() => !!user.value?.UserAccount)

  function setUser(u: User | null) {
    user.value = u
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }

  function setLang(l: string) {
    lang.value = l
    localStorage.setItem(LANG_KEY, l)
  }

  function setPrivs(list: string[]) {
    privs.value = list
  }

  function logout() {
    setUser(null)
    privs.value = []
  }

  return {
    user,
    lang,
    privs,
    machineId,
    isLoggedIn,
    setUser,
    setLang,
    setPrivs,
    logout,
  }
})

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}
