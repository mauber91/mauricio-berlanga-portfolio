import { useState } from 'react'
import App from './App'
import { FocusedPortfolio } from './components/FocusedPortfolio'
import { UiModeToggle } from './components/UiModeToggle'
import { getArticleByPath } from './data/articles'
import { stripSiteBase } from './lib/paths'

type UiMode = 'classic' | 'focused'
const uiModeKey = 'mauricio-portfolio-ui-mode'

function initialMode(): UiMode {
  const requestedMode = new URLSearchParams(window.location.search).get('ui')
  if (requestedMode === 'focused' || requestedMode === 'classic') return requestedMode
  try { return window.localStorage.getItem(uiModeKey) === 'focused' ? 'focused' : 'classic' } catch { return 'classic' }
}

export function PortfolioRoot() {
  const [mode, setMode] = useState<UiMode>(initialMode)
  const articleRoute = Boolean(getArticleByPath(stripSiteBase(window.location.pathname)))

  const toggleMode = () => {
    const nextMode = mode === 'focused' ? 'classic' : 'focused'
    try { window.localStorage.setItem(uiModeKey, nextMode) } catch { /* in-memory fallback */ }
    setMode(nextMode)
  }

  return (
    <>
      <UiModeToggle mode={mode} onToggle={toggleMode} />
      {mode === 'focused' && !articleRoute ? <FocusedPortfolio /> : <App />}
    </>
  )
}
