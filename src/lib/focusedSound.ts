export type FocusedCue = 'tick' | 'press' | 'toggle'

type CueOptions = {
  force?: boolean
}

let audioContext: AudioContext | null = null
let soundEnabled = true

export function setFocusedSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
}

export async function playFocusedCue(kind: FocusedCue, options: CueOptions = {}) {
  if (typeof window === 'undefined' || !soundEnabled) return false

  const supportsAudio = typeof window.AudioContext !== 'undefined'
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!supportsAudio || (!supportsFinePointer && !options.force)) return false

  audioContext ??= new window.AudioContext()
  if (audioContext.state === 'suspended') await audioContext.resume()

  const now = audioContext.currentTime
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const frequency = kind === 'toggle' ? 440 : kind === 'press' ? 330 : 560
  const duration = kind === 'press' ? 0.12 : 0.085

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, now)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.12, now + duration * 0.6)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(kind === 'press' ? 0.065 : 0.05, now + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  oscillator.connect(gain).connect(audioContext.destination)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.01)
  return true
}
