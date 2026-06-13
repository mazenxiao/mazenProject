/**
 * 扫码抽象层
 *
 * 旧 Cordova `cordova-plugin-cszbar` / Honeywell ScannerPlugin
 * → 新版用浏览器原生能力代替：
 *
 *   1. KeyboardScanner（默认）：监听 keydown，缓冲到 Enter 提交
 *      工业 PDA 扫码枪默认 HID 键盘流，扫码 → 输出字符 + Enter
 *
 *   2. CameraScanner（降级）：getUserMedia + @zxing/browser
 *      手机/PC 摄像头扫码；需要 HTTPS 或 localhost
 *
 * <ScanInput /> 组件会优先用 KeyboardScanner，按需切到 CameraScanner。
 */

export interface IScanner {
  start(handler: (code: string) => void): void
  stop(): void
}

/**
 * 键盘流扫码器 —— 监听全局 keydown，缓冲字符到 Enter 提交
 *
 * 启发式过滤：
 *   - 只接受可见字符（length === 1）和 Enter
 *   - 输入间隔 > 300ms 视为人类输入，丢弃缓冲
 *   - 修饰键（Shift/Ctrl/Alt/Meta）单独按下时忽略
 */
export class KeyboardScanner implements IScanner {
  private buffer = ''
  private lastTs = 0
  private handler: ((code: string) => void) | null = null
  private readonly onKey = (e: KeyboardEvent) => this.handleKey(e)

  /** 扫码间隔阈值；> 此值视为人类输入而非扫码枪 */
  static SCANNER_GAP_MS = 50
  static HUMAN_GAP_MS = 300
  /** 最短码长 —— 防止误触 */
  static MIN_LENGTH = 3

  start(handler: (code: string) => void): void {
    this.handler = handler
    window.addEventListener('keydown', this.onKey, true)
  }

  stop(): void {
    this.handler = null
    this.buffer = ''
    window.removeEventListener('keydown', this.onKey, true)
  }

  private handleKey(e: KeyboardEvent): void {
    const now = Date.now()
    const gap = now - this.lastTs
    this.lastTs = now

    if (gap > KeyboardScanner.HUMAN_GAP_MS) {
      this.buffer = ''
    }

    if (e.key === 'Enter') {
      const code = this.buffer
      this.buffer = ''
      if (code.length >= KeyboardScanner.MIN_LENGTH) {
        e.preventDefault()
        this.handler?.(code)
      }
      return
    }

    // 跳过修饰键
    if (e.key.length !== 1) return
    this.buffer += e.key
  }
}

/**
 * 摄像头扫码器（懒加载 @zxing/browser）
 */
export class CameraScanner implements IScanner {
  private reader: any = null
  private videoEl: HTMLVideoElement | null = null
  private stopped = false

  constructor(private readonly attachTo: HTMLVideoElement) {
    this.videoEl = attachTo
  }

  async start(handler: (code: string) => void): Promise<void> {
    this.stopped = false
    const { BrowserMultiFormatReader } = await import('@zxing/browser')
    this.reader = new BrowserMultiFormatReader()
    if (!this.videoEl) return
    await this.reader.decodeFromConstraints(
      {
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      },
      this.videoEl,
      (result: any) => {
        if (this.stopped) return
        if (result) handler(result.getText())
      },
    )
  }

  stop(): void {
    this.stopped = true
    try {
      this.reader?.reset?.()
    } catch {
      // ignore
    }
  }
}
