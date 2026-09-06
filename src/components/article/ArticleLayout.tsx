import { ArrowLeft, ArrowUpRight, BookOpen, Clock3, Code2, FileText } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { Header } from '../Header'
import type { ArticleMeta } from '../../data/articles'
import { sitePath } from '../../lib/paths'

type ArticleLayoutProps = {
  article: ArticleMeta
  stats: Array<{ value: string; label: string }>
  sections: Array<{ id: string; label: string }>
  children: ReactNode
}

const defaultDisclosure =
  'Adapted from my academic paper with AI assistance for readability; I checked every number against the paper and frozen results. The paper and repository are authoritative.'

export function ArticleLayout({ article, stats, sections, children }: ArticleLayoutProps) {
  useEffect(() => {
    document.title = `${article.title} — Mauricio Berlanga`
    document.querySelector('meta[name="description"]')?.setAttribute('content', article.description)
    window.scrollTo(0, 0)
  }, [article])

  const hasSources = Boolean(article.paper || article.repository || article.notebook)

  return (
    <div className="field-page article-site" id="top">
      <a className="skip-link" href="#article-content">Skip to article</a>
      <Header homeLinks />

      <main id="article-content">
        <header className="article-hero field-shell">
          <div className="article-hero-rail field-rail">
            <a className="article-back" href={sitePath('/#writing')}><ArrowLeft size={14} /> All writing</a>
            <p>Field note</p>
            <span>{article.projectType ?? 'Course project'}</span>
            <span>{article.readTime}</span>
          </div>
          <div className="article-hero-content">
            <a className="article-course" href={sitePath('/#education')}>{article.course}</a>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.description}</p>
            <div className="article-byline">
              <span>Mauricio Berlanga</span>
              <span><Clock3 size={13} /> {article.readTime}</span>
              <span>{article.projectType ?? 'Course project'}</span>
            </div>
            <ul className="article-tags">{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            {article.tldr && (
              <aside className="article-tldr" aria-label="Summary">
                <b>TL;DR</b>
                <ul>
                  <li><strong>Problem:</strong> {article.tldr.problem}</li>
                  <li><strong>Method:</strong> {article.tldr.method}</li>
                  <li><strong>Result:</strong> {article.tldr.result}</li>
                  <li><strong>Honest caveat:</strong> {article.tldr.caveat}</li>
                </ul>
              </aside>
            )}
            {article.leadImage && (
              <figure className="article-hero-figure">
                <div>
                  <img
                    src={sitePath(article.leadImage)}
                    alt={article.leadImageAlt ?? ''}
                    width={article.leadImageWidth}
                    height={article.leadImageHeight}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </figure>
            )}
          </div>
        </header>

        <section className="article-stats field-shell" aria-label="Project highlights">
          <div className="article-stats-rail field-rail">
            <p>At a glance</p>
            <span>Evidence from the study</span>
          </div>
          <div className="article-stats-main">
            {stats.map((stat) => <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>)}
          </div>
        </section>

        <div className="article-layout field-shell">
          <aside className="article-toc field-rail" aria-label="Article contents">
            <p>In this article</p>
            <nav>{sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}</nav>
            {hasSources && (
              <div className="article-sources">
                <p className="article-rail-label">Primary sources</p>
                {article.paper && (
                  <a className="article-repo-link" href={sitePath(article.paper)} target="_blank" rel="noreferrer">
                    <FileText size={14} /> Paper (PDF) <ArrowUpRight size={13} />
                  </a>
                )}
                {article.repository && (
                  <a className="article-repo-link" href={article.repository} target="_blank" rel="noreferrer">
                    <Code2 size={14} /> Repository <ArrowUpRight size={13} />
                  </a>
                )}
                {article.notebook && (
                  <a className="article-repo-link" href={sitePath(article.notebook)} target="_blank" rel="noreferrer">
                    <BookOpen size={14} /> Results notebook <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            )}
          </aside>
          <article className="article-prose">{children}</article>
        </div>
      </main>

      <footer className="article-footer field-footer field-shell">
        <p className="article-disclosure"><em>About this write-up.</em> {article.disclosure ?? defaultDisclosure}</p>
        <a href={sitePath('/#writing')}><ArrowLeft size={14} /> More writing</a>
        <p>© {new Date().getFullYear()} Mauricio Berlanga</p>
        <a href={sitePath('/#top')}>Back to top</a>
      </footer>
    </div>
  )
}
