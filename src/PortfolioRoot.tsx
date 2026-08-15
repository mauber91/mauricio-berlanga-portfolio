import { lazy, Suspense } from 'react'
import App from './App'
import { FocusedPortfolio } from './components/FocusedPortfolio'
import { getArticleByPath } from './data/articles'
import { stripSiteBase } from './lib/paths'

type UiMode = 'classic' | 'focused'
const GamePortfolio = lazy(() => import('./game/GamePortfolio').then((module) => ({ default: module.GamePortfolio })))

function initialMode(): UiMode {
  const requestedMode = new URLSearchParams(window.location.search).get('ui')
  return requestedMode === 'focused' ? 'focused' : 'classic'
}

export function PortfolioRoot() {
  const mode = initialMode()
  const currentPath = stripSiteBase(window.location.pathname)
  const articleRoute = Boolean(getArticleByPath(currentPath))
  const gameRoute = currentPath === '/game' || currentPath === '/game/'

  if (gameRoute) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#f7f1e7', background: '#071b27', font: '600 12px ui-monospace, monospace' }}>Opening Mauricio’s interactive CV…</div>}>
        <GamePortfolio />
      </Suspense>
    )
  }

  return mode === 'focused' && !articleRoute ? <FocusedPortfolio /> : <App />
}
