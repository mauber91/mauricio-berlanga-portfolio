import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { sitePath } from '../lib/paths'

const navigation = [
  ['Work', '#work'],
  ['Writing', '#writing'],
  ['Experience', '#experience'],
  ['About', '#about'],
  ['Contact', '#contact'],
]

export function Header({ homeLinks = false }: { homeLinks?: boolean }) {
  const [open, setOpen] = useState(false)

  const hrefFor = (href: string) => homeLinks ? sitePath(`/#${href.slice(1)}`) : href

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header className="site-header">
      <a className="wordmark" href={homeLinks ? sitePath('/#top') : '#top'} aria-label="Mauricio Berlanga, home">
        Mauricio Berlanga
      </a>

      <nav id="primary-navigation" className={`navigation ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <a key={href} href={hrefFor(href)} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="icon-button menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  )
}
