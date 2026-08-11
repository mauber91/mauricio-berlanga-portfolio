import { lazy, Suspense, useState } from 'react'
import App from './App'
import { FocusedPortfolio } from './components/FocusedPortfolio'
import { UiModeToggle } from './components/UiModeToggle'
import { getArticleByPath } from './data/articles'
import { stripSiteBase } from './lib/paths'

type UiMode = 'classic' | 'focused'
const uiModeKey = 'mauricio-portfolio-ui-mode'
const GamePortfolio = lazy(() => import('./game/GamePortfolio').then((module) => ({ default: module.GamePortfolio })))

function initialMode(): UiMode {
  const requestedMode = new URLSearchParams(window.location.search).get('ui')
  if (requestedMode === 'focused' || requestedMode === 'classic') return requestedMode
  try { return window.localStorage.getItem(uiModeKey) === 'focused' ? 'focused' : 'classic' } catch { return 'classic' }
}

export function PortfolioRoot() {
  const [mode, setMode] = useState<UiMode>(initialMode)
  const currentPath = stripSiteBase(window.location.pathname)
  const articleRoute = Boolean(getArticleByPath(currentPath))
  const gameRoute = currentPath === '/game' || currentPath === '/game/'

  const toggleMode = () => {
    const nextMode = mode === 'focused' ? 'classic' : 'focused'
    try { window.localStorage.setItem(uiModeKey, nextMode) } catch { /* in-memory fallback */ }
    setMode(nextMode)
  }

  if (gameRoute) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#f7f1e7', background: '#071b27', font: '600 12px ui-monospace, monospace' }}>Opening the Systems District…</div>}>
        <GamePortfolio />
      </Suspense>
    )
  }

  return (
    <>
      <UiModeToggle mode={mode} onToggle={toggleMode} />
      {mode === 'focused' && !articleRoute ? <FocusedPortfolio /> : <App />}
    </>
  )
}
