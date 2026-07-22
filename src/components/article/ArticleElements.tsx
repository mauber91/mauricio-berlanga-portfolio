import { Lightbulb } from 'lucide-react'
import type { ReactNode } from 'react'

export function PlainLanguage({ children }: { children: ReactNode }) {
  return (
    <aside className="plain-language">
      <Lightbulb size={17} />
      <div><b>In plain language</b><p>{children}</p></div>
    </aside>
  )
}

export function Equation({ children, label }: { children: ReactNode; label?: string }) {
  return <div className="article-equation">{label && <span>{label}</span>}<code>{children}</code></div>
}

export function ArticleFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="article-figure">
      <div><img src={src} alt={alt} loading="lazy" /></div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
