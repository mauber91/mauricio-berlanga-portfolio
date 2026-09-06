import { ArrowDown, ArrowRight, ArrowUpRight, FileText } from 'lucide-react'
import { Header } from './components/Header'
import { ArticlePage } from './components/article/ArticlePage'
import { articles, getArticleByPath } from './data/articles'
import {
  education,
  experience,
  featuredProjects,
  githubProjects,
  interactiveCvProject,
  personal,
  proofStrip,
  skillGroups,
  socialLinks,
  trackLabel,
} from './data/content'
import { sitePath, stripSiteBase } from './lib/paths'

function App() {
  const activeArticle = getArticleByPath(stripSiteBase(window.location.pathname))
  if (activeArticle) return <ArticlePage article={activeArticle} />

  return (
    <div className="field-page" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />

      <main id="main">
        <section className="field-intro field-shell" aria-labelledby="intro-title">
          <div className="field-intro-copy">
            <p className="field-status">{personal.status}</p>
            <h1 id="intro-title">Nine years building frontends. Lately, the <em>ML systems</em> behind them too.</h1>
            <p>I’m a senior engineer at Walmart Global Tech, where I look after the frontend platform for Global Sourcing and built the code retrieval for an internal coding agent. On the side I’m working through Stanford’s AI graduate certificate and writing up what I try, including the parts that didn’t work.</p>
            <div className="field-cta-row">
              <a className="field-btn field-btn-accent" href="#work">See the work <ArrowDown size={14} aria-hidden="true" /></a>
              <a className="field-btn" href={`mailto:${personal.email}`}>Email me</a>
            </div>
          </div>

          <aside className="field-context" aria-label="What I am working on now">
            <p className="field-context-label">Currently</p>
            <p className="field-context-value">{personal.now.currently}</p>
            <p className="field-context-label">Recently shipped</p>
            <p className="field-context-value">{personal.now.recentlyShipped}</p>
            <p className="field-context-label">Reading</p>
            <p className="field-context-value">{personal.now.reading}</p>
            <p className="field-context-label">Stack this week</p>
            <p className="field-context-value field-context-stack">{personal.now.stack.join(' · ')}</p>
          </aside>
        </section>

        <section className="field-proof field-shell" aria-label="Selected outcomes">
          {proofStrip.map((item) => (
            <a className={`field-proof-item track-${item.track}`} href={sitePath(item.href)} key={item.value}>
              <span className="field-proof-label">{item.label}</span>
              <b>{item.value}</b>
              <p>{item.text}</p>
            </a>
          ))}
        </section>

        <section className="field-section field-shell" id="work" aria-labelledby="projects-title">
          <span className="anchor-alias" id="projects" aria-hidden="true" />
          <div className="field-rail">
            <p>Selected work</p>
            <span>Four things I’d point to first</span>
          </div>
          <div className="field-section-main">
            <div className="field-heading-row field-heading-row-wrap">
              <h2 id="projects-title" className="field-section-title">Selected work</h2>
              <ul className="field-track-legend" aria-label="Track legend">
                <li className="track-ai">ML</li>
                <li className="track-frontend">Frontend</li>
                <li className="track-both">Both</li>
              </ul>
              <a className="field-link" href="#public-work">All projects &amp; repos <ArrowRight size={14} aria-hidden="true" /></a>
            </div>

            <div className="field-card-grid">
              {featuredProjects.map((project) => (
                <article className="field-card" key={project.title}>
                  {project.image ? (
                    <img className="field-card-thumb" src={sitePath(project.image)} alt="" loading="lazy" width={1200} height={630} />
                  ) : (
                    <div className={`field-card-thumb field-card-thumb-${project.visual}`} aria-hidden="true" />
                  )}
                  <p className={`field-tag track-${project.track}`}>{trackLabel[project.track]} · {project.context}</p>
                  <h3>{project.title}</h3>
                  <p className="field-card-outcome"><b>{project.outcome}</b><span>{project.outcomeLabel}</span></p>
                  <p className="field-card-desc">{project.description}</p>
                  <p className="field-index-stack">{project.technologies.join(' · ')}</p>
                  <div className="field-link-row">
                    {project.article && (
                      <a className="field-link" href={sitePath(project.article)}>
                        Case study <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.paper && (
                      <a className="field-link" href={sitePath(project.paper)} target="_blank" rel="noreferrer">
                        Paper (PDF) <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.github && (
                      <a className="field-link" href={project.github} target="_blank" rel="noreferrer">
                        Repo <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.demo && (
                      <a className="field-link" href={project.demo} target="_blank" rel="noreferrer">
                        Live demo <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="public-work" aria-labelledby="public-work-title">
          <div className="field-rail">
            <p>Public work</p>
            <span>Smaller things, mostly for fun</span>
          </div>
          <div className="field-section-main">
            <div className="field-heading-row">
              <h2 id="public-work-title" className="field-section-title">More work</h2>
              <a className="field-link" href="https://github.com/mauber91" target="_blank" rel="noreferrer">
                GitHub profile <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="field-index">
              {[interactiveCvProject, ...githubProjects.filter((project) => !project.homepageHidden)].map((project) => {
                const href = project.local ? sitePath(project.url) : project.url
                const external = project.local ? {} : { target: '_blank', rel: 'noreferrer' }
                return (
                  <article className="field-index-row" key={project.repository}>
                    <div className="field-index-meta">
                      <p>{project.category}</p>
                      <span>{project.activity}</span>
                    </div>
                    <div>
                      <h3><a href={href} {...external}>{project.title}</a></h3>
                      <p>{project.description}</p>
                      <p className="field-index-stack">{project.technologies.join(' · ')}</p>
                    </div>
                    <div className="field-index-links">
                      {project.local ? (
                        <a href={href}>Play it <ArrowRight size={13} aria-hidden="true" /></a>
                      ) : (
                        <a href={href} target="_blank" rel="noreferrer">View source <ArrowUpRight size={13} aria-hidden="true" /></a>
                      )}
                      {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={13} aria-hidden="true" /></a>}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="notes" aria-labelledby="notes-title">
          <span className="anchor-alias" id="writing" aria-hidden="true" />
          <div className="field-rail">
            <p>Writing</p>
            <span>Longer write-ups, including the ones that didn’t pan out</span>
          </div>
          <div className="field-section-main">
            <h2 id="notes-title" className="field-section-title">Writing</h2>
            <div className="field-writing-list">
              {articles.map((article) => (
                <a className="field-writing-row" href={sitePath(article.path)} key={article.title}>
                  <p>{article.course}</p>
                  <h3>{article.title}</h3>
                  <span>{article.readTime}{article.paper && <FileText size={13} aria-label="Paper available" />}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="experience" aria-labelledby="experience-title">
          <div className="field-rail">
            <p>Experience</p>
            <span>Frontend since 2015; ML inside the day job since 2024</span>
          </div>
          <div className="field-section-main">
            <h2 id="experience-title" className="field-section-title">Experience</h2>
            <div className="field-ledger">
              {experience.map((item) => (
                <article className="field-ledger-row" key={`${item.company}-${item.period}`}>
                  <div className="field-ledger-meta">
                    <p>{item.period}</p>
                  </div>
                  <div className="field-ledger-title">
                    <h3>{item.role}</h3>
                    <span>{item.company}</span>
                  </div>
                  <div className="field-ledger-role">
                    <p>{item.description}</p>
                    {item.bullets && (
                      <ul className="field-ledger-bullets">
                        {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    )}
                    {item.tracks && (
                      <div className="field-tag-row" aria-label="Tracks">
                        {item.tracks.map((track) => <span className={`field-tag track-${track}`} key={track}>{trackLabel[track]}</span>)}
                      </div>
                    )}
                    <ul className="field-inline-list" aria-label={`${item.role} focus areas`}>
                      {item.focus.map((focus) => <li key={focus}>{focus}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="research" aria-labelledby="research-title">
          <span className="anchor-alias" id="education" aria-hidden="true" />
          <div className="field-rail">
            <p>Education and skills</p>
            <span>Coursework and the tools I reach for</span>
          </div>
          <div className="field-section-main">
            <h2 id="research-title" className="field-section-title">Education and working set</h2>
            <div className="field-education">
              {education.map((item) => (
                <article className="field-education-row" key={item.institution}>
                  <div>
                    <p>{item.institution}</p>
                    <span>{item.note}</span>
                  </div>
                  <div>
                    <h3>{item.program}</h3>
                    {item.courses.length > 0 && (
                      <ul>
                        {item.courses.map(([code, name]) => <li key={code}><b>{code}</b><span>{name}</span></li>)}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="field-skill-list">
              {skillGroups.map((group) => (
                <article className="field-skill-row" key={group.title}>
                  <h3>{group.title}</h3>
                  <p>{group.skills.join(' · ')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell field-about-detail" id="about" aria-labelledby="about-detail-title">
          <div className="field-rail">
            <p>About</p>
            <span>A bit more background</span>
          </div>
          <div className="field-section-main">
            <h2 id="about-detail-title" className="field-section-title">About</h2>
            <div className="field-about-grid">
              <p className="field-about-lead">{personal.summary}</p>
              <div>
                <p>At Walmart I’ve owned a couple of large frontend platforms, mentored interns, interviewed a lot of candidates, and become the person other teams message when a React bug gets weird. I like working closely with product and design rather than receiving handoffs from them.</p>
                <p>The ML work didn’t start in a classroom. An internal coding agent was spending most of its context window on file lookups, so I built retrieval for it. That went well enough that I wanted to understand the underlying methods properly, which is how the Stanford certificate, the routing project, and COLMo happened. I’m still early on that side and I try to write in a way that makes that clear.</p>
                <p>The AI project I’m fondest of is also the smallest: a WhatsApp bot that gives a family member access to open models for her home business. No benchmark, no paper. It’s a good reminder that a tool only counts if it fits into someone’s actual day.</p>
              </div>
            </div>
            <blockquote className="field-principle">
              <p>One lesson I keep coming back to: architecture is also about what you choose not to add. An abstraction has to earn its operational and cognitive cost.</p>
            </blockquote>
          </div>
        </section>

        <section className="field-section field-shell field-contact" id="contact" aria-labelledby="contact-title">
          <div className="field-rail">
            <p>Contact</p>
            <span>{personal.location}</span>
          </div>
          <div className="field-section-main">
            <h2 id="contact-title" className="field-section-title">Say hello</h2>
            <p className="field-contact-copy">I’m happy at Walmart and not in a rush, but I’d like my next role to sit closer to the ML side of this page. If you’re working on something like that, or just want to compare notes on anything above, email works best.</p>
            <div className="field-contact-links">
              {socialLinks.map((link) => (
                <a
                  href={sitePath(link.href)}
                  key={link.label}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span><b>{link.label}</b><small>{link.display}</small></span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="field-footer field-shell">
        <p>© {new Date().getFullYear()} Mauricio Berlanga</p>
        <p>
          React 19 · TypeScript · Vite · hand-written CSS ·{' '}
          <a href="https://github.com/mauber91/mauricio-berlanga-portfolio" target="_blank" rel="noreferrer">View this site’s source</a>
        </p>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}

export default App
