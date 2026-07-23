import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, Code2, FlaskConical, Mail } from 'lucide-react'
import { Header } from './components/Header'
import { SectionHeader } from './components/SectionHeader'
import { HeroSystemMap, ProjectVisual } from './components/TechnicalVisuals'
import { ArticlePage } from './components/article/ArticlePage'
import { articles, getArticleByPath } from './data/articles'
import { education, experience, githubProjects, personal, projects, researchThemes, skillGroups, socialLinks } from './data/content'
import { sitePath, stripSiteBase } from './lib/paths'

function App() {
  const activeArticle = getArticleByPath(stripSiteBase(window.location.pathname))
  if (activeArticle) return <ArticlePage article={activeArticle} />

  const githubProfile = socialLinks.find((link) => link.label === 'GitHub')
  const linkedInProfile = socialLinks.find((link) => link.label === 'LinkedIn')

  return (
    <div id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />

      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker">Mauricio Berlanga</p>
            <h1 id="hero-title">Engineering systems that <em>learn, reason,</em> and perform.</h1>
            <p className="hero-summary">{personal.summary}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View projects <ArrowDown size={15} /></a>
              <a className="text-link" href={githubProfile?.href} target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub <ArrowUpRight size={14} /></a>
              <a className="text-link" href={linkedInProfile?.href} target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="hero-visual"><HeroSystemMap /></div>
          <div className="hero-meta">
            <span><b>10+</b> years engineering</span>
            <span><b>03</b> Stanford AI/ML courses</span>
            <span><b>∞</b> experiments ahead</span>
            <span><b>HQ</b> {personal.location}</span>
          </div>
        </section>

        <section className="section shell about" id="about">
          <SectionHeader eyebrow="01 / About" title="Production engineering depth. Expanding AI scope." />
          <div className="about-grid reveal">
            <p className="lead-copy">
              I’m a senior software engineer at <strong>Walmart Global Tech</strong> with more than ten years of experience building dependable web and frontend systems at scale.
            </p>
            <div className="about-detail">
              <p>My foundation is production software: React architecture, modular frontend systems, monorepos, API integration, and the engineering discipline required to operate software over time.</p>
              <p>That foundation now extends into AI engineering and machine learning systems through graduate-level Stanford coursework and hands-on work with retrieval, model evaluation, local inference, and agentic architectures.</p>
            </div>
            <blockquote>
              <FlaskConical size={19} />
              <p>I’m most interested in problems where the answer is not obvious beforehand: define the measure, build the system, study its failures, change the architecture, and prove whether it improved.</p>
            </blockquote>
          </div>
        </section>

        <section className="section shell" id="experience">
          <SectionHeader eyebrow="02 / Experience" title="Engineering for scale and longevity." copy="A software engineering track record grounded in architecture, collaboration, and production reliability." />
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item reveal" key={item.company}>
                <div className="timeline-marker"><i /></div>
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-main">
                  <div className="timeline-title">
                    <div><h3>{item.role}</h3><p>{item.company}</p></div>
                  </div>
                  <p>{item.description}</p>
                  <ul className="tag-list">{item.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section research-section" id="research">
          <div className="shell">
            <SectionHeader eyebrow="03 / AI & Research" title="From models to working systems." copy="An evolving technical portfolio across retrieval, learning, evaluation, and distributed intelligence." />
            <div className="research-grid">
              {researchThemes.map((theme) => (
                <article className="research-card reveal" key={theme.number}>
                  <div className="research-number">{theme.number}</div>
                  <div>
                    <h3>{theme.title}</h3>
                    <p>{theme.description}</p>
                    <ul className="inline-list">{theme.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  </div>
                  <ArrowUpRight size={18} className="research-arrow" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="projects">
          <SectionHeader eyebrow="04 / Featured Projects" title="Experiment. Measure. Refine." copy="Selected systems and studies, including useful negative results and active research directions." />
          <div className="projects-grid">
            {projects.filter((project) => project.featured).map((project, index) => (
              <article className="project-card reveal" key={project.title}>
                <div className="project-topline"><span>0{index + 1}</span><span className={`status status-${project.status.toLowerCase()}`}>{project.status}</span></div>
                <ProjectVisual type={project.visual} />
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="project-insight"><b>What mattered</b>{project.insight}</p>
                  <ul className="tag-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                  {(project.article || project.github) && (
                    <div className="project-links">
                      {project.article && <a href={sitePath(project.article)}>Read case study <ArrowRight size={15} /></a>}
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={15} /></a>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="github-projects">
            <div className="github-projects-header reveal">
              <div>
                <p className="eyebrow">Recent on GitHub</p>
                <h3>Public work, from research systems to product experiments.</h3>
              </div>
              <a className="text-link" href={githubProfile?.href} target="_blank" rel="noreferrer">
                View profile <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="github-projects-grid">
              {githubProjects.map((project, index) => (
                <article className="github-project reveal" key={project.repository}>
                  <div className="github-project-meta">
                    <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
                    <span>{project.activity}</span>
                  </div>
                  <h3>
                    <a href={project.url} target="_blank" rel="noreferrer">
                      {project.title} <ArrowUpRight size={16} />
                    </a>
                  </h3>
                  <p>{project.description}</p>
                  <ul className="tag-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                  <div className="github-project-footer">
                    <a href={project.url} target="_blank" rel="noreferrer"><Code2 size={14} /> mauber91/{project.repository}</a>
                    {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={13} /></a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="education">
          <SectionHeader eyebrow="05 / Education" title="Theory supporting practice." copy="Graduate-level AI and ML study paired with a foundation in information systems engineering." />
          <div className="education-grid">
            {education.map((item) => (
              <article className="education-card reveal" key={item.institution}>
                <div className="education-heading">
                  <div><p>{item.institution}</p><h3>{item.program}</h3></div>
                </div>
                <p className="education-note">{item.note}</p>
                {item.courses.length > 0 && (
                  <div className="course-list">
                    {item.courses.map(([code, name]) => <div key={code}><b>{code}</b><span>{name}</span></div>)}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section skills-section">
          <div className="shell">
            <SectionHeader eyebrow="06 / Technical Range" title="A stack shaped by systems." />
            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article className="skill-group reveal" key={group.title}>
                  <h3>{group.title}</h3>
                  <p>{group.skills.join(' · ')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="writing">
          <SectionHeader eyebrow="07 / Writing & Notes" title="Learning in public." copy="Technical project write-ups with enough context to make the underlying ideas accessible beyond AI and ML specialists." />
          <div className="writing-list">
            {articles.map((article, index) => (
              <a className="writing-item reveal" href={sitePath(article.path)} key={article.title}>
                <span>0{index + 1}</span>
                <div><p>{article.course}</p><h3>{article.title}</h3></div>
                <span className="coming-soon">Read · {article.readTime.replace(' read', '')}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">08 / Contact</p>
              <h2>Let’s build something technically ambitious.</h2>
              <p>Interested in AI engineering, ML systems, research engineering, or software that demands strong technical foundations? Let’s talk.</p>
              <a className="button button-primary" href={`mailto:${personal.email}`}>Start a conversation <ArrowRight size={16} /></a>
            </div>
            <div className="contact-links">
              {socialLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {link.label === 'GitHub' && <Code2 size={18} />}
                  {link.label === 'LinkedIn' && <BriefcaseBusiness size={18} />}
                  {link.label === 'Email' && <Mail size={18} />}
                  <span><b>{link.label}</b><small>{link.display}</small></span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer shell">
        <p>© {new Date().getFullYear()} Mauricio Berlanga</p>
        <p>Senior Software Engineer · AI / ML Systems</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  )
}

export default App
