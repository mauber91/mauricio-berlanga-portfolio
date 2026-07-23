import { ArrowLeft, ArrowUpRight, Clock3, Code2 } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import type { ArticleMeta } from '../../data/articles'
import { sitePath } from '../../lib/paths'

type ArticleLayoutProps = {
  article: ArticleMeta
  stats: Array<{ value: string; label: string }>
  sections: Array<{ id: string; label: string }>
  children: ReactNode
}

export function ArticleLayout({ article, stats, sections, children }: ArticleLayoutProps) {
  useEffect(() => {
    document.title = `${article.title} — Mauricio Berlanga`
    document.querySelector('meta[name="description"]')?.setAttribute('content', article.description)
    window.scrollTo(0, 0)
  }, [article])

  return (
    <div className="article-site">
      <a className="skip-link" href="#article-content">Skip to article</a>
      <header className="article-topbar">
        <a className="wordmark" href={sitePath('/')} aria-label="Mauricio Berlanga, home"><span>MB</span><i /></a>
        <a className="article-back" href={sitePath('/#writing')}><ArrowLeft size={14} /> All writing</a>
        <ThemeToggle />
      </header>

      <main id="article-content">
        <header className="article-hero shell">
          <a className="article-course" href={sitePath('/#education')}>{article.course}</a>
          <h1>{article.title}</h1>
          <p className="article-dek">{article.description}</p>
          <div className="article-byline">
            <span>Mauricio Berlanga</span>
            <span><Clock3 size={13} /> {article.readTime}</span>
            <span>{article.projectType ?? 'Course project'}</span>
          </div>
          <ul className="article-tags">{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </header>

        <section className="article-stats shell" aria-label="Project highlights">
          {stats.map((stat) => <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>)}
        </section>

        <div className="article-layout shell">
          <aside className="article-toc" aria-label="Article contents">
            <p>In this article</p>
            <nav>{sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}</nav>
            {article.repository && (
              <a className="article-repo-link" href={article.repository} target="_blank" rel="noreferrer">
                <Code2 size={14} /> View repository <ArrowUpRight size={13} />
              </a>
            )}
          </aside>
          <article className="article-prose">{children}</article>
        </div>
      </main>

      <footer className="article-footer shell">
        <a href={sitePath('/#writing')}><ArrowLeft size={14} /> More writing</a>
        <p>© {new Date().getFullYear()} Mauricio Berlanga</p>
      </footer>
    </div>
  )
}
