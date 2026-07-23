import { Equation, PlainLanguage } from './ArticleElements'
import { ArticleLayout } from './ArticleLayout'
import type { ArticleMeta } from '../../data/articles'

const sections = [
  { id: 'bet', label: 'The economic bet' },
  { id: 'architecture', label: 'System architecture' },
  { id: 'verification', label: 'Verification loop' },
  { id: 'experiment', label: 'Experiment design' },
  { id: 'privacy', label: 'Measuring privacy' },
  { id: 'status', label: 'Current evidence' },
  { id: 'next', label: 'What would change my mind' },
]

export function ColmoArticle({ article }: { article: ArticleMeta }) {
  return (
    <ArticleLayout
      article={article}
      sections={sections}
      stats={[
        { value: '7', label: 'Systems in shared harness' },
        { value: '150', label: 'Frozen QASPER examples' },
        { value: '3×', label: 'Cloud-token reduction target' },
        { value: '30%', label: 'Canary injection rate' },
      ]}
    >
      <p className="article-lead">
        Long documents create an awkward economics problem for language models: the most capable cloud model is useful for judgment, but much of the bill comes from repeatedly reading context. COLMo asks whether the expensive model can supervise the work while a local model does most of that reading.
      </p>

      <section id="bet">
        <p className="article-section-number">01</p>
        <h2>The economic bet: cloud thinks, local reads</h2>
        <p>
          COLMo stands for <strong>Cloud-Orchestrated Local Models</strong>. It is not a new foundation model. It is a delegation protocol and measurement harness for context-heavy tasks over documents that should preferably remain local.
        </p>
        <p>
          The cloud supervisor handles decomposition, routing, selective verification, and final synthesis. A locally hosted Qwen model reads document chunks, extracts evidence, summarizes, compares, and classifies. If the split works, high-volume tokens stay on hardware that has near-zero marginal API cost while the strongest model is reserved for lower-volume decisions.
        </p>
        <Equation label="Primary efficiency target">
          cloud-token reduction = cloud-only tokens ÷ COLMo cloud tokens ≥ 3×
        </Equation>
        <PlainLanguage>
          Imagine a senior researcher who plans the investigation and reviews the conclusions, while an on-premises team reads the full archive. The senior researcher sees concise evidence packets—not every page in the archive.
        </PlainLanguage>
        <p>
          This idea has an important failure mode: cheap cloud mini-models may perform the worker role just as well and cost less than operating local hardware. COLMo therefore includes a cloud-mini-worker control. If it wins on cost and quality, privacy—not economics—must carry the argument for local execution.
        </p>
      </section>

      <section id="architecture">
        <p className="article-section-number">02</p>
        <h2>A small protocol around two model tiers</h2>
        <div className="routing-diagram" aria-label="COLMo decomposition, local execution, verification, and synthesis pipeline">
          <div><span>01</span><b>Cloud</b><small>decompose</small></div>
          <i>→</i>
          <div><span>02</span><b>Local</b><small>read + execute</small></div>
          <i>→</i>
          <div className="active"><span>03</span><b>Gate</b><small>verify</small></div>
          <i>→</i>
          <div><span>04</span><b>Cloud</b><small>synthesize</small></div>
        </div>
        <p>
          The supervisor initially receives the question and chunk metadata, not the raw document. It emits typed subtasks—<code>extract</code>, <code>summarize</code>, <code>compare</code>, or <code>classify</code>—and associates each with a chunk. The local worker then receives the actual text and returns a structured answer with supporting evidence.
        </p>
        <p>
          The current router is deliberately static. The first experiment is about whether verified delegation works at all, not whether a learned router can squeeze out another percentage point. Responses are cached in SQLite, while JSONL accounting records tokens, estimated cost, latency, retries, escalations, and bytes crossing the local-to-cloud boundary.
        </p>
      </section>

      <section id="verification">
        <p className="article-section-number">03</p>
        <h2>Verification is the safety mechanism</h2>
        <p>
          Local execution is only useful if weak or malformed outputs are caught before final synthesis. Each delegated result passes through a gate: parse the expected schema, require an answer, ask the cloud verifier to compare the claimed evidence with a bounded chunk excerpt, then accept, retry locally, or escalate a filtered excerpt to the cloud.
        </p>
        <div className="article-split" aria-label="Verification decisions">
          <div><b>Accept</b><span>schema + evidence pass</span></div>
          <div><b>Retry</b><span>local worker tries again</span></div>
          <div><b>Escalate</b><span>cloud reads a bounded excerpt</span></div>
        </div>
        <p>
          Verification itself has a cost and a privacy surface: the cloud sees the proposed answer, cited evidence, and up to a short excerpt. The study therefore treats verification as a measurable component rather than an automatically beneficial feature. A no-verifier ablation tests whether the gate is actually load-bearing.
        </p>
        <PlainLanguage>
          The verifier is quality control, not magic. It can reject good work, approve bad work, or expose too much evidence to the cloud. Those failure modes are logged and compared instead of being hidden behind a single accuracy score.
        </PlainLanguage>
      </section>

      <section id="experiment">
        <p className="article-section-number">04</p>
        <h2>One harness, seven competing systems</h2>
        <p>
          The active domain is long-document question answering on a frozen 150-example subset of QASPER; the pilot uses 20 examples. Documents range from roughly 1,250 to 13,500 words. Answer quality is measured with token-level F1 and exact match, while the systems also report cloud tokens, estimated dollars, latency, boundary bytes, retries, and canary leakage.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead><tr><th>System</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td>Cloud-only</td><td>Quality ceiling; the frontier model reads the full document.</td></tr>
              <tr><td>Local-only</td><td>No-cloud quality floor and latency reference.</td></tr>
              <tr><td>Naive preprocess</td><td>Local summary or redaction followed by a cloud answer.</td></tr>
              <tr><td>MinionS-style</td><td>Decompose and delegate without an independent verifier.</td></tr>
              <tr><td>Cloud mini-workers</td><td>Economic control using a cheap API model for worker tasks.</td></tr>
              <tr><td>COLMo v0</td><td>Full local-worker system with verification and escalation.</td></tr>
              <tr><td>COLMo, no verifier</td><td>Ablation testing whether verification improves the tradeoff.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The main hypotheses were written down before the full run: retain at least 95% of cloud-only F1, reduce cloud tokens by at least 3×, show that removing verification hurts, and demonstrate lower private-data leakage than cloud mini-workers at matched quality. Falsification thresholds are explicit so an inconvenient result still teaches us something.
        </p>
      </section>

      <section id="privacy">
        <p className="article-section-number">05</p>
        <h2>Privacy needs a boundary and a meter</h2>
        <p>
          “The document stays local” would be too broad a claim: verified answers and selected evidence still cross the boundary. COLMo measures both the total bytes sent to cloud calls and whether unique synthetic canary strings embedded in local documents appear in cloud-bound messages.
        </p>
        <Equation label="Canary leakage rate">
          leakage = unique canaries observed by cloud ÷ unique canaries injected
        </Equation>
        <p>
          Canaries are injected into 30% of examples with a fixed random seed. They are not equivalent to real personally identifiable information, but they provide a repeatable test of whether supposedly local content escapes through decomposition, verification, or synthesis. The cloud-mini-worker baseline makes the comparison especially sharp because its workers necessarily receive the text they process.
        </p>
      </section>

      <section id="status">
        <p className="article-section-number">06</p>
        <h2>Current evidence—and what is still unknown</h2>
        <p>
          The research harness, seven systems, versioned prompts, QASPER loader, accounting pipeline, response cache, and leakage instrumentation are implemented. The 150-example dataset is frozen. A live 20-example local-only run completed at <strong>0.23 mean token F1</strong> and <strong>0.05 exact match</strong>, with no cloud tokens and roughly 15 minutes of runtime.
        </p>
        <p>
          That number is a systems check, not evidence that COLMo succeeds. Token F1 can penalize a verbose answer even when it contains the short gold span, and there is not yet a live cloud-only or COLMo-v0 result for comparison. The core cost–quality and verifier hypotheses remain open until the cloud-backed pilot and full evaluation run.
        </p>
        <blockquote>A work-in-progress research page should make uncertainty visible. The missing comparison is the result that matters most.</blockquote>
      </section>

      <section id="next">
        <p className="article-section-number">07</p>
        <h2>What would change my mind</h2>
        <p>
          The next milestone is the live pilot across all systems, followed by the full paired evaluation with bootstrap confidence intervals. Several outcomes would force a change in the story:
        </p>
        <ol>
          <li><strong>Less than 2× cloud-token reduction</strong> would falsify the economic thesis in its current form.</li>
          <li><strong>Quality below 90% of cloud-only</strong> would show that local delegation loses too much information.</li>
          <li><strong>No-verifier quality within two points</strong> would suggest that the gate adds complexity without carrying its weight.</li>
          <li><strong>Cloud mini-workers matching leakage</strong> would weaken the privacy case as well as the cost case.</li>
        </ol>
        <p>
          If COLMo clears those tests, later work will move beyond document QA into code localization and multi-step tool workflows, then sweep local model sizes. If it does not, the negative result will still locate a useful boundary: when local inference, verification, or privacy accounting fails to justify the orchestration overhead.
        </p>
      </section>
    </ArticleLayout>
  )
}
