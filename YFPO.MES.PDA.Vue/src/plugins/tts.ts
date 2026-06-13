/**
 * TTS 语音播报 —— 替代旧 cordova-plugin-tts
 *
 * 使用浏览器原生 Web Speech API（window.speechSynthesis）
 * 注意：
 *   - 需要 HTTPS 或 localhost
 *   - 中文音色依赖系统语音包，不同浏览器表现不同
 *   - PDA WebView 可能不支持，调用前 isSupported() 兜底
 */

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export interface SpeakOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!isTtsSupported() || !text) return
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang ?? 'zh-CN'
    u.rate = opts.rate ?? 1
    u.pitch = opts.pitch ?? 1
    u.volume = opts.volume ?? 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch (e) {
    console.warn('[tts] speak failed', e)
  }
}

export function stopSpeak(): void {
  if (isTtsSupported()) window.speechSynthesis.cancel()
}
