import { ArrowLeftRight } from 'lucide-react'

type UiModeToggleProps = {
  mode: 'classic' | 'focused'
  onToggle: () => void
}

export function UiModeToggle({ mode, onToggle }: UiModeToggleProps) {
  const nextMode = mode === 'focused' ? 'classic' : 'focused'
  return (
    <button className="ui-mode-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${nextMode} portfolio UI`} title={`Switch to ${nextMode} portfolio UI`}>
      <ArrowLeftRight size={14} /><span>{mode === 'focused' ? 'Classic UI' : 'Focused UI'}</span>
    </button>
  )
}
