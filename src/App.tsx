import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Header } from './components/Header'
import { ArticlePage } from './components/article/ArticlePage'
import { articles, getArticleByPath } from './data/articles'
import {
  education,
  experience,
  githubProjects,
  personal,
  projects,
  researchThemes,
  skillGroups,
  socialLinks,
} from './data/content'
import { sitePath, stripSiteBase } from './lib/paths'

function App() {
  const activeArticle = getArticleByPath(stripSiteBase(window.location.pathname))
  if (activeArticle) return <ArticlePage article={activeArticle} />

  const featuredArticle = articles.find((article) => article.slug === 'world-cup-semifinal-forecast') ?? articles[0]

  return (
    <div className="field-page" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />

      <main id="main">
        <section className="field-intro field-shell" aria-labelledby="intro-title">
          <div className="field-intro-copy">
            <p className="field-status"><span aria-hidden="true" className="field-status-dot" />{personal.availability}</p>
            <h1 id="intro-title">I build the production frontends people use, and the <em>ML systems</em> that decide what they see, then measure whether either one worked.</h1>
            <p>Senior engineer at Walmart Global Tech (9 years shipping React/TypeScript platforms). Now building retrieval, model-routing, and evaluation systems for LLM products, with graduate AI coursework at Stanford.</p>
            <div className="field-cta-row">
              <a className="field-btn field-btn-accent" href="#work">See selected work <ArrowDown size={14} aria-hidden="true" /></a>
              <a className="field-btn" href={sitePath(personal.resumePath)} target="_blank" rel="noreferrer">Résumé (PDF)</a>
              <a className="field-btn" href={`mailto:${personal.email}`}>Email</a>
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

        <section className="field-section field-shell field-feature-section" id="work" aria-labelledby="featured-note-title">
          <div className="field-rail" aria-hidden="true" />
          <div className="field-section-main">
            <article className="featured-note">
              <div className="featured-primary">
                <p className="field-kicker">Featured field note</p>
                <h2 id="featured-note-title">How a probabilistic model found<br /> 3 of 4 World Cup semifinalists</h2>
                <p className="featured-dek">The bracket was the visible result.<br /> The probability pipeline underneath it was the real project.</p>
              </div>

              <aside className="featured-margin" aria-label="Reflection on the project">
                <div className="featured-margin-rule" aria-hidden="true" />
                <div>
                  <h3>What changed my mind</h3>
                  <p>A tournament prediction is not four isolated picks. Strength uncertainty, score distributions, tie-break rules, and every upstream result reshape the paths that remain possible.</p>
                </div>
              </aside>

              <div className="featured-evidence">
                <div className="featured-meta">
                  <p>Independent <span>·</span> Probabilistic forecasting</p>
                  <em>Three of four semifinalists</em>
                </div>

                <figure className="featured-figure">
                  <img
                    src={sitePath('/articles/world-cup-forecast-social.png')}
                    alt="Thousands of tournament paths converge into four semifinal nodes, three highlighted in green and one in amber"
                  />
                  <figcaption>Figure 1 · Many simulated tournament paths, summarized as one projected bracket.</figcaption>
                  <a className="field-link field-link-accent" href={sitePath(featuredArticle.path)}>
                    Read the note <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </figure>
              </div>
            </article>
          </div>
        </section>

        <section className="field-section field-shell" id="experience" aria-labelledby="experience-title">
          <div className="field-rail" aria-hidden="true" />
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
                    <ul className="field-inline-list" aria-label={`${item.role} focus areas`}>
                      {item.focus.map((focus) => <li key={focus}>{focus}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="projects" aria-labelledby="projects-title">
          <div className="field-rail">
            <p>Selected work</p>
            <span>Systems, studies, and useful failures</span>
          </div>
          <div className="field-section-main">
            <div className="field-heading-row">
              <h2 id="projects-title" className="field-section-title">Projects</h2>
              <p>Four projects where the implementation and the evidence both matter.</p>
            </div>

            <div className="field-project-list">
              {projects.filter((project) => project.featured).map((project) => (
                <article className="field-project" key={project.title}>
                  <div className="field-project-heading">
                    <p>{project.status.toLowerCase()}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <div className="field-project-copy">
                    <p>{project.description}</p>
                    <p className="field-project-insight"><span>What I learned</span>{project.insight}</p>
                    <ul className="field-inline-list" aria-label={`${project.title} technologies`}>
                      {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                    {(project.article || project.github) && (
                      <div className="field-link-row">
                        {project.article && (
                          <a className="field-link" href={sitePath(project.article)}>
                            Read case study <ArrowRight size={14} aria-hidden="true" />
                          </a>
                        )}
                        {project.github && (
                          <a className="field-link" href={project.github} target="_blank" rel="noreferrer">
                            View source <ArrowUpRight size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
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
            <span>Recent repositories and experiments</span>
          </div>
          <div className="field-section-main">
            <div className="field-heading-row">
              <h2 id="public-work-title" className="field-section-title">More things I’ve built</h2>
              <a className="field-link" href="https://github.com/mauber91" target="_blank" rel="noreferrer">
                GitHub profile <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="field-index">
              {githubProjects.map((project) => (
                <article className="field-index-row" key={project.repository}>
                  <div className="field-index-meta">
                    <p>{project.category}</p>
                    <span>{project.activity}</span>
                  </div>
                  <div>
                    <h3><a href={project.url} target="_blank" rel="noreferrer">{project.title}</a></h3>
                    <p>{project.description}</p>
                    <p className="field-index-stack">{project.technologies.join(' · ')}</p>
                  </div>
                  <div className="field-index-links">
                    <a href={project.url} target="_blank" rel="noreferrer">View source <ArrowUpRight size={13} aria-hidden="true" /></a>
                    {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={13} aria-hidden="true" /></a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="notes" aria-labelledby="notes-title">
          <span className="anchor-alias" id="writing" aria-hidden="true" />
          <div className="field-rail">
            <p>Notes</p>
            <span>Technical writing in plain language</span>
          </div>
          <div className="field-section-main">
            <h2 id="notes-title" className="field-section-title">Writing and field notes</h2>
            <div className="field-writing-list">
              {articles.map((article) => (
                <a className="field-writing-row" href={sitePath(article.path)} key={article.title}>
                  <p>{article.course}</p>
                  <h3>{article.title}</h3>
                  <span>{article.readTime}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section field-shell" id="research" aria-labelledby="research-title">
          <div className="field-rail">
            <p>Study</p>
            <span>Research themes and formal coursework</span>
          </div>
          <div className="field-section-main">
            <div className="field-heading-row">
              <h2 id="research-title" className="field-section-title">Research and education</h2>
              <p>Across retrieval, routing, and local inference, I try to write down the hypothesis and the failure condition before I build.</p>
            </div>
            <div className="field-research-grid">
              {researchThemes.map((theme) => (
                <article className="field-research-item" key={theme.title}>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                  <p className="field-index-stack">{theme.tags.join(' · ')}</p>
                </article>
              ))}
            </div>

            <div className="field-education" id="education">
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
          </div>
        </section>

        <section className="field-section field-shell" aria-labelledby="range-title">
          <div className="field-rail">
            <p>Technical range</p>
            <span>Tools I use, not a keyword cloud</span>
          </div>
          <div className="field-section-main">
            <h2 id="range-title" className="field-section-title">A practical working set</h2>
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
            <span>Frontend foundations, applied intelligence</span>
          </div>
          <div className="field-section-main">
            <h2 id="about-detail-title" className="field-section-title">What I work on</h2>
            <div className="field-about-grid">
              <p className="field-about-lead">{personal.summary}</p>
              <div>
                <p>At Walmart, I have owned large frontend platforms, led teams, interviewed candidates, mentored interns, and supported other teams on difficult React bugs and architectural decisions. Product, design, backend, and engineering partners are part of the work—not handoffs around it.</p>
                <p>My AI work grew from the same habit: notice a practical constraint, design an experiment, and measure the tradeoff. That has led to semantic code retrieval, verifier-aware model routing, local/cloud orchestration, and graduate study at Stanford.</p>
                <p>One of my favorite AI projects was also one of the smallest: a WhatsApp assistant that gave a family member access to open models for her home business and for learning. It reinforced something I try to keep in larger systems too: technical quality includes whether the interface is accessible, the behavior is legible, and the tool actually fits into someone’s life.</p>
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
            <p className="field-contact-copy">I enjoy comparing notes with people working on frontend platforms, applied AI, research tooling, and products where the tradeoffs deserve careful thought.</p>
            <div className="field-contact-links">
              {socialLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span><b>{link.label}</b><small>{link.display}</small></span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
              <a href={sitePath('/game/')}>
                <span><b>Interactive CV</b><small>A more playful version of the résumé</small></span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="field-footer field-shell">
        <p>© {new Date().getFullYear()} Mauricio Berlanga</p>
        <p>Built as a record of work in progress.</p>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}

export default App
