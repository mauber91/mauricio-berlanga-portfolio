import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['AI & Research', '#research'],
  ['Projects', '#projects'],
  ['Education', '#education'],
  ['Writing', '#writing'],
  ['Contact', '#contact'],
]

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Mauricio Berlanga, home">
        <span>MB</span><i />
      </a>

      <nav id="primary-navigation" className={`navigation ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>

      <div className="header-actions">
        <ThemeToggle />
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
