<template>
  <div class="scan-input">
    <van-field
      v-model="text"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="!disabled"
      :ref="(el: any) => (fieldEl = el)"
      @keyup.enter="onEnter"
    >
      <template #button v-if="cameraEnabled">
        <van-button size="small" type="primary" @click="toggleCamera">
          {{ cameraOn ? '关闭摄像头' : '摄像头扫码' }}
        </van-button>
      </template>
    </van-field>

    <div v-if="cameraOn" class="scan-input__video-wrap">
      <video ref="videoEl" class="scan-input__video" muted playsinline />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { KeyboardScanner, CameraScanner } from '@/plugins/scanner'

interface Props {
  label?: string
  placeholder?: string
  modelValue?: string
  disabled?: boolean
  /** auto: 键盘流（默认）；camera: 启用摄像头；keyboard: 仅键盘 */
  mode?: 'auto' | 'keyboard' | 'camera'
  /** 是否在 mounted 后 800ms 自动 focus（与旧版一致） */
  autofocus?: boolean
  /** 是否显示摄像头按钮 */
  cameraEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '请扫描或输入',
  modelValue: '',
  disabled: false,
  mode: 'auto',
  autofocus: true,
  cameraEnabled: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'scan', code: string): void
}>()

const text = ref(props.modelValue)
const cameraOn = ref(false)
const fieldEl = ref<any>(null)
const videoEl = ref<HTMLVideoElement | null>(null)

let kbScanner: KeyboardScanner | null = null
let camScanner: CameraScanner | null = null

watch(
  () => props.modelValue,
  (v) => {
    text.value = v
  },
)

watch(text, (v) => {
  emit('update:modelValue', v)
})

function fire(code: string) {
  if (!code) return
  text.value = code
  emit('update:modelValue', code)
  emit('scan', code)
}

function onEnter() {
  if (text.value) fire(text.value)
}

async function toggleCamera() {
  if (cameraOn.value) {
    cameraOn.value = false
    camScanner?.stop()
    camScanner = null
    return
  }
  cameraOn.value = true
  await nextTick()
  if (!videoEl.value) return
  camScanner = new CameraScanner(videoEl.value)
  await camScanner.start((c) => fire(c))
}

onMounted(() => {
  if (props.mode !== 'camera') {
    kbScanner = new KeyboardScanner()
    kbScanner.start((c) => fire(c))
  }
  if (props.autofocus) {
    setTimeout(() => fieldEl.value?.focus?.(), 800)
  }
})

onBeforeUnmount(() => {
  kbScanner?.stop()
  kbScanner = null
  camScanner?.stop()
  camScanner = null
})
</script>

<style lang="scss" scoped>
.scan-input {
  &__video-wrap {
    margin-top: 8px;
    width: 100%;
    max-height: 240px;
    overflow: hidden;
    background: #000;
    border-radius: 4px;
  }
  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
