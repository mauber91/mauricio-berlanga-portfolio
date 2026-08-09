import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { articles } from '../data/articles'
import { experience, personal, projects, skillGroups, socialLinks } from '../data/content'
import { playFocusedCue, setFocusedSoundEnabled } from '../lib/focusedSound'
import { sitePath } from '../lib/paths'

type ProjectTone = {
  label: string
  color: string
  image?: string
}

const projectTones: Record<string, ProjectTone> = {
  'Intelligent Code Search / RAG Pipeline': { label: 'Product system', color: '#176b65' },
  'USD/MXN ML Forecasting Study': { label: 'CS229 study', color: '#b75d3b', image: '/articles/usdmxn-social.png' },
  'Verifier-Aware Model Routing for Code Generation': { label: 'CS224R study', color: '#6941c6', image: '/articles/model-routing-social.png' },
  'COLMo: Cloud-Orchestrated Local Models': { label: 'Research system', color: '#28746b', image: '/articles/colmo-social.png' },
}

const featuredSkillTitles = ['Frontend Systems', 'Frontend Product Craft', 'AI / ML']

function cue(kind: 'tick' | 'press' | 'toggle') {
  void playFocusedCue(kind)
}

function ProjectArt({ title, className = '' }: { title: string; className?: string }) {
  const tone = projectTones[title] ?? { label: 'Selected work', color: '#176b65' }
  return (
    <div className={`focused-project-art ${className}`} style={{ '--project-tone': tone.color } as React.CSSProperties}>
      {tone.image ? <img src={sitePath(tone.image)} alt="" /> : null}
      <div className="focused-project-art-grid" />
      <span>{tone.label}</span>
      <b>{title.split(/[:/]/)[0].trim().split(' ').slice(0, 2).map((word) => word[0]).join('')}</b>
    </div>
  )
}

export function FocusedPortfolio() {
  const [selectedTitle, setSelectedTitle] = useState(projects[0].title)
  const [soundOn, setSoundOn] = useState(true)
  const selectedProject = projects.find((project) => project.title === selectedTitle) ?? projects[0]
  const selectedTone = projectTones[selectedProject.title] ?? { label: 'Selected work', color: '#176b65' }
  const selectedArticle = articles.find((article) => article.path === selectedProject.article)
  const featuredSkills = useMemo(() => skillGroups.filter((group) => featuredSkillTitles.includes(group.title)), [])

  const toggleSound = () => {
    const nextValue = !soundOn
    setSoundOn(nextValue)
    setFocusedSoundEnabled(nextValue)
    if (nextValue) void playFocusedCue('toggle', { force: true })
  }

  const selectProject = (title: string) => {
    setSelectedTitle(title)
    cue('tick')
  }

  return (
    <div className="focused-app">
      <header className="focused-topbar">
        <a className="focused-wordmark" href="#top" onClick={() => cue('press')}>
          <i /> MB / 91
        </a>
        <nav className="focused-nav" aria-label="Portfolio sections">
          <a href="#work" onClick={() => cue('tick')}>Work</a>
          <a href="#experience" onClick={() => cue('tick')}>Experience</a>
          <a href="#notes" onClick={() => cue('tick')}>Notes</a>
          <a href="#contact" onClick={() => cue('tick')}>Contact</a>
        </nav>
        <button className="focused-sound-toggle" type="button" onClick={toggleSound} aria-pressed={soundOn}>
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{soundOn ? 'Sound cues on' : 'Sound cues off'}</span>
        </button>
      </header>

      <main id="top">
        <section className="focused-hero">
          <div className="focused-shell focused-hero-grid">
            <div className="focused-hero-copy">
              <p className="focused-kicker">Mauricio Berlanga <span>·</span> Senior Software Engineer</p>
              <h1>Frontend platforms for <em>intelligent</em> products.</h1>
              <p className="focused-hero-summary">I build production interfaces and AI systems that make complex work feel clear, fast, and dependable.</p>
              <div className="focused-hero-actions">
                <a className="focused-primary-button" href="#work" onClick={() => cue('press')}>See selected work <ArrowDown size={15} /></a>
                <a className="focused-text-link" href="mailto:mberlanga91@gmail.com" onClick={() => cue('press')}>Start a conversation <ArrowUpRight size={15} /></a>
              </div>
              <div className="focused-hero-metrics" aria-label="Career highlights">
                <span><b>9+</b> years shipping software</span>
                <span><b>6+</b> years at Walmart Global Tech</span>
                <span><b>4</b> featured AI projects</span>
              </div>
            </div>
            <aside className="focused-hero-card">
              <div className="focused-hero-card-top"><span>Current focus</span><span className="focused-status-dot">Available for the right problem</span></div>
              <ProjectArt title={selectedProject.title} className="focused-hero-art" />
              <div className="focused-hero-card-copy">
                <p className="focused-card-label">Interface · model · measurement</p>
                <h2>Systems that connect the human layer to the model layer.</h2>
                <p>From Nx and Module Federation platforms to local-model orchestration, the through-line is the same: make the system legible enough to trust.</p>
                <a href="#work" className="focused-inline-link" onClick={() => cue('press')}>Explore the work <ArrowRight size={15} /></a>
              </div>
            </aside>
          </div>
        </section>

        <section id="work" className="focused-section focused-work-section">
          <div className="focused-shell">
            <div className="focused-section-heading">
              <p className="focused-eyebrow">01 / Selected work</p>
              <h2>Built, studied, and <em>measured.</em></h2>
              <p>Four projects across retrieval, forecasting, routing, and local/cloud AI systems. Each one starts with a practical question and ends with evidence.</p>
            </div>
            <div className="focused-work-layout">
              <div className="focused-project-list">
                {projects.map((project, index) => {
                  const isSelected = project.title === selectedProject.title
                  const tone = projectTones[project.title] ?? { label: 'Selected work', color: '#176b65' }
                  return (
                    <button
                      className={`focused-project-row${isSelected ? ' is-selected' : ''}`}
                      key={project.title}
                      type="button"
                      onClick={() => selectProject(project.title)}
                      style={{ '--project-tone': tone.color } as React.CSSProperties}
                    >
                      <span className="focused-project-index">0{index + 1}</span>
                      <span className="focused-project-row-copy"><b>{project.title}</b><small>{tone.label} · {project.status}</small></span>
                      <ArrowRight className="focused-project-arrow" size={17} />
                    </button>
                  )
                })}
              </div>
              <article className="focused-selected-project" style={{ '--project-tone': selectedTone.color } as React.CSSProperties}>
                <ProjectArt title={selectedProject.title} className="focused-selected-art" />
                <div className="focused-selected-copy">
                  <p className="focused-card-label">{selectedTone.label} <span>·</span> {selectedProject.status}</p>
                  <h3>{selectedProject.title}</h3>
                  <p>{selectedProject.description}</p>
                  <p className="focused-insight"><strong>What mattered</strong>{selectedProject.insight}</p>
                  <div className="focused-tag-list">{selectedProject.technologies.slice(0, 5).map((technology) => <span key={technology}>{technology}</span>)}</div>
                  <div className="focused-link-row">
                    {selectedProject.article ? <a href={sitePath(selectedProject.article)} onClick={() => cue('press')}>Read case study <ArrowUpRight size={14} /></a> : <span className="focused-muted-link">Case study in progress</span>}
                    {selectedProject.github ? <a href={selectedProject.github} target="_blank" rel="noreferrer" onClick={() => cue('press')}>Repository <ExternalLink size={13} /></a> : null}
                  </div>
                  {selectedArticle ? <p className="focused-read-meta">{selectedArticle.readTime} · {selectedArticle.course}</p> : null}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="experience" className="focused-section focused-experience-section">
          <div className="focused-shell">
            <div className="focused-section-heading focused-section-heading-compact">
              <p className="focused-eyebrow">02 / Career & practice</p>
              <h2>Platform thinking, <em>applied.</em></h2>
            </div>
            <div className="focused-practice-grid">
              <div className="focused-timeline">
                {experience.slice(0, 4).map((role, index) => (
                  <article className="focused-timeline-item" key={`${role.company}-${role.role}`}>
                    <div className="focused-timeline-marker"><span>{index === 0 ? <Check size={11} /> : index + 1}</span></div>
                    <div className="focused-timeline-copy"><p className="focused-period">{role.period}</p><h3>{role.role} <span>at {role.company}</span></h3><p>{role.description}</p><div className="focused-mini-tags">{role.focus.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div></div>
                  </article>
                ))}
              </div>
              <aside className="focused-expertise-card">
                <div className="focused-expertise-icon"><Code2 size={18} /></div>
                <p className="focused-card-label">What I bring</p>
                <h3>Strong frontend foundations, curious AI instincts.</h3>
                <p>Years of platform work shape how I approach ML products: clear boundaries, useful defaults, observable behavior, and interfaces that respect the person using them.</p>
                <div className="focused-expertise-list">
                  {featuredSkills.map((group) => <div key={group.title}><b>{group.title}</b><div>{group.skills.slice(0, 7).map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="notes" className="focused-section focused-notes-section">
          <div className="focused-shell">
            <div className="focused-section-heading focused-section-heading-row"><div><p className="focused-eyebrow">03 / Notes from the work</p><h2>Make the hard parts <em>legible.</em></h2></div><p>Technical writing for curious people: enough detail to be useful, enough context to stay human.</p></div>
            <div className="focused-notes-grid">
              {articles.map((article) => <a className="focused-note-card" href={sitePath(article.path)} key={article.slug} onClick={() => cue('press')}><span className="focused-note-course">{article.course}</span><h3>{article.title}</h3><p>{article.description}</p><span className="focused-note-footer">{article.readTime}<ArrowUpRight size={15} /></span></a>)}
            </div>
          </div>
        </section>

        <section id="contact" className="focused-contact-section">
          <div className="focused-shell focused-contact-grid">
            <div><p className="focused-eyebrow">04 / Contact</p><h2>Have a problem worth <em>untangling?</em></h2></div>
            <div className="focused-contact-copy"><p>I’m interested in ambitious frontend platforms, applied AI, and the connective tissue between a good model and a good product.</p><div className="focused-contact-links"><a href={`mailto:${personal.email}`} onClick={() => cue('press')}><Mail size={15} /> {personal.email}</a>{socialLinks.filter((link) => link.label !== 'Email').map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer" onClick={() => cue('press')}><ExternalLink size={14} /> {link.label}</a>)}</div></div>
          </div>
        </section>
      </main>

      <footer className="focused-footer"><div className="focused-shell"><span>© {new Date().getFullYear()} Mauricio Berlanga</span><span>Frontend platforms · Applied AI · Learning in public</span></div></footer>
    </div>
  )
}
