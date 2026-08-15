import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './focused.css'
import './field-notes.css'
import { PortfolioRoot } from './PortfolioRoot'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioRoot />
  </StrictMode>,
)
