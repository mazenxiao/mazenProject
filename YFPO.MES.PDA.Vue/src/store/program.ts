/**
 * Pinia 程序/菜单态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Program } from '@/models'

export const useProgramStore = defineStore('program', () => {
  const programs = ref<Program[]>([])
  const currentPrivilegeList = ref<string[]>([])

  function setPrograms(list: Program[]) {
    programs.value = list || []
  }

  function setPrivileges(list: string[]) {
    currentPrivilegeList.value = list || []
  }

  return { programs, currentPrivilegeList, setPrograms, setPrivileges }
})
