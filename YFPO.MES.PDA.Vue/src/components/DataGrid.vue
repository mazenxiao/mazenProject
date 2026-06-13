<template>
  <vxe-grid
    v-bind="gridOptions"
    :data="data"
    :loading="loading"
    @cell-click="onCellClick"
  />
</template>

<script setup lang="ts">
/**
 * DataGrid —— vxe-table 二次封装，统一 PDA / PC 表格样式
 *
 * 替代旧 DevExtreme DataGrid。本实现只覆盖最常用：
 * 列配置、点选、加载态。复杂场景（行内编辑、分组、虚拟滚动）
 * 由具体业务页直接使用 vxe-grid。
 */
import { computed } from 'vue'

export interface DataGridColumn {
  field: string
  title: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  formatter?: (val: any, row: any) => string
  fixed?: 'left' | 'right'
}

interface Props {
  columns: DataGridColumn[]
  data: any[]
  loading?: boolean
  height?: number | string
  rowConfig?: { isCurrent?: boolean; isHover?: boolean }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: 'auto',
  rowConfig: () => ({ isCurrent: true, isHover: true }),
})

const emit = defineEmits<{
  (e: 'cell-click', payload: { row: any; column: any }): void
}>()

const gridOptions = computed(() => ({
  border: true,
  stripe: true,
  showOverflow: 'tooltip' as const,
  height: props.height,
  rowConfig: props.rowConfig,
  columns: props.columns.map((c) => ({
    field: c.field,
    title: c.title,
    width: c.width,
    minWidth: c.minWidth,
    align: c.align ?? 'left',
    fixed: c.fixed,
    formatter: c.formatter
      ? ({ cellValue, row }: any) => c.formatter!(cellValue, row)
      : undefined,
  })),
}))

function onCellClick(payload: { row: any; column: any }) {
  emit('cell-click', payload)
}
</script>

<style scoped>
:deep(.vxe-grid) {
  font-size: 13px;
}
</style>
