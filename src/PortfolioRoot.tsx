import { lazy, Suspense } from 'react'
import App from './App'
import { stripSiteBase } from './lib/paths'

const GamePortfolio = lazy(() => import('./game/GamePortfolio').then((module) => ({ default: module.GamePortfolio })))

export function PortfolioRoot() {
  const currentPath = stripSiteBase(window.location.pathname)
  const gameRoute = currentPath === '/game' || currentPath === '/game/'

  if (gameRoute) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#f7f1e7', background: '#071b27', font: '600 12px ui-monospace, monospace' }}>Opening Mauricio’s interactive CV…</div>}>
        <GamePortfolio />
      </Suspense>
    )
  }

  return <App />
}
