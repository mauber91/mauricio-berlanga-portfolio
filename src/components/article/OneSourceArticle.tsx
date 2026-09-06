import { PlainLanguage } from './ArticleElements'
import { ArticleLayout } from './ArticleLayout'
import type { ArticleMeta } from '../../data/articles'

const sections = [
  { id: 'context', label: 'Context and constraints' },
  { id: 'options', label: 'Options considered' },
  { id: 'decision', label: 'The decision' },
  { id: 'left-out', label: 'What we chose not to add' },
  { id: 'consequences', label: 'Consequences and cost' },
  { id: 'reuse', label: 'What was reused later' },
]

export function OneSourceArticle({ article }: { article: ArticleMeta }) {
  return (
    <ArticleLayout
      article={article}
      sections={sections}
      stats={[
        { value: 'N', label: 'teams on the platform · TODO(owner)' },
        { value: 'Per team', label: 'independent release cadence' },
        { value: 'Nx + MF', label: 'chosen platform' },
        { value: 'N', label: 'apps migrated · TODO(owner)' },
      ]}
    >
      <p className="article-lead">
        OneSource is the frontend platform for Walmart’s Global Sourcing organization. When it was time to decide how several teams would ship React applications inside one product, the default answer was a heavier internal framework. This is the record of why we chose an Nx monorepo with Module Federation instead, what we deliberately left out, and what the choice cost to operate.
      </p>

      <section id="context">
        <p className="article-section-number">01</p>
        <h2>Context and constraints</h2>
        <p>
          Several teams owned distinct parts of the sourcing workflow, each with its own release rhythm and its own backlog. They needed to appear to the user as one coherent product, share authentication and navigation, and integrate with Java/Spring APIs and the existing production delivery workflow.
        </p>
        <p>
          The organization also carried legacy Angular applications and more than one React version. Any platform decision had to leave a path for those applications to join the shell without a rewrite.
        </p>
        <p>
          TODO(owner): add the concrete constraints that mattered most (team count, release frequency targets, compliance or deployment requirements).
        </p>
        <PlainLanguage>
          The question was not “which framework is best?” but “which platform lets independent teams ship without stepping on each other, at a cost we can keep paying?”
        </PlainLanguage>
      </section>

      <section id="options">
        <p className="article-section-number">02</p>
        <h2>Options considered</h2>
        <p>
          <strong>The internal framework.</strong> Mature, supported by a central team, and already used elsewhere in the company. It came with a large runtime, opinionated build tooling, and a coupling model that made independent deploys harder than they looked.
        </p>
        <p>
          <strong>Separate repositories with a thin shell.</strong> Maximum autonomy, but duplicated tooling, drifting dependency versions, and no shared place for design-system and utility code.
        </p>
        <p>
          <strong>An Nx monorepo with Module Federation.</strong> One workspace for shared libraries, lint rules, and generators; independently built and deployed remotes composed at runtime by a host shell; and a path for Angular and older React applications to be wrapped as remotes.
        </p>
        <p>
          TODO(owner): if other options were evaluated (for example single-spa or iframes), add them here with the reason they were rejected.
        </p>
      </section>

      <section id="decision">
        <p className="article-section-number">03</p>
        <h2>The decision</h2>
        <p>
          We chose the Nx and Module Federation platform. The deciding factors were independent releases per team, a single place for shared code with enforced boundaries, and a build model that engineers could reason about end to end without a central team in the loop.
        </p>
        <p>
          The evaluation was practical rather than theoretical: a small pilot remote was built, deployed, and composed into the shell, and the resulting developer workflow was compared against the internal framework’s equivalent path.
        </p>
        <PlainLanguage>
          The lighter platform won because a team could understand every step between a commit and a release. That legibility mattered more than any single feature.
        </PlainLanguage>
      </section>

      <section id="left-out">
        <p className="article-section-number">04</p>
        <h2>What we chose not to add</h2>
        <p>
          A shared runtime state layer between remotes was intentionally left out; each remote owns its state and communicates through URL and a narrow event contract. A custom CLI on top of Nx was also rejected, because the generators Nx already provides covered the repetitive work.
        </p>
        <p>
          One lesson I keep coming back to: architecture is also about what you choose not to add. An abstraction has to earn its operational and cognitive cost, and several candidates did not.
        </p>
      </section>

      <section id="consequences">
        <p className="article-section-number">05</p>
        <h2>Consequences and cost</h2>
        <p>
          Teams release independently, and a bug in one remote no longer blocks another team’s deploy. Shared libraries live in one place with lint-enforced module boundaries, which made cross-team refactors tractable.
        </p>
        <p>
          The cost is real: shared-dependency versions between host and remotes must be managed deliberately, and runtime composition introduces failure modes that a single bundle does not have. TODO(owner): add the specific operational issues you hit and how they were addressed.
        </p>
      </section>

      <section id="reuse">
        <p className="article-section-number">06</p>
        <h2>What was reused later</h2>
        <p>
          The host/remote pattern, the module-boundary rules, and the wrapping approach for legacy Angular applications became the shared reference for later micro-frontend work in the organization. TODO(owner): name or count the later applications that adopted the pattern.
        </p>
        <PlainLanguage>
          A platform decision is only good if the next team can pick it up without you in the room. That was the test this one had to pass.
        </PlainLanguage>
      </section>
    </ArticleLayout>
  )
}
