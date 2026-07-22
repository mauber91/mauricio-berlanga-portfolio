import { ArticleFigure, Equation, PlainLanguage } from './ArticleElements'
import { ArticleLayout } from './ArticleLayout'
import type { ArticleMeta } from '../../data/articles'

const sections = [
  { id: 'problem', label: 'The routing problem' },
  { id: 'bandit', label: 'Bandit formulation' },
  { id: 'evaluation', label: 'Leakage-safe evaluation' },
  { id: 'policies', label: 'Policies compared' },
  { id: 'results', label: 'Results' },
  { id: 'audit', label: 'The scoring audit' },
  { id: 'rl', label: 'Why REINFORCE struggled' },
  { id: 'takeaways', label: 'Practical takeaways' },
]

export function Cs224rArticle({ article }: { article: ArticleMeta }) {
  return (
    <ArticleLayout
      article={article}
      sections={sections}
      stats={[
        { value: '0.958', label: 'MBPP hidden pass rate' },
        { value: '16.9%', label: 'Tasks escalated' },
        { value: '19–23%', label: 'Held-out API spend' },
        { value: '427', label: 'Development tasks' },
      ]}
    >
      <p className="article-lead">
        A small local model is inexpensive but imperfect. A frontier model is stronger but costly. This project asked whether a router could decide—task by task—when the local answer was good enough and when paying for a stronger model was justified.
      </p>

      <section id="problem">
        <p className="article-section-number">01</p>
        <h2>The routing problem</h2>
        <p>
          Most LLM routers make a decision before generation, based on prompt length, topic, or a model’s confidence. Code offers a more concrete signal. We can let the cheap model write a solution, run visible unit tests, and use the result before deciding whether to escalate.
        </p>
        <div className="routing-diagram" aria-label="Cheap model, verifier, and optional API escalation flow">
          <div><span>01</span><b>Local model</b><small>generate code</small></div>
          <i>→</i>
          <div className="active"><span>02</span><b>Verifier</b><small>run visible tests</small></div>
          <i>→</i>
          <div><span>03</span><b>Route</b><small>keep or escalate</small></div>
          <i>→</i>
          <div><span>04</span><b>Strong model</b><small>only if needed</small></div>
        </div>
        <PlainLanguage>
          Think of this as technical support with triage. A fast first-line engineer handles routine cases. A measurable check decides whether the result is acceptable. Only failures go to the expensive specialist.
        </PlainLanguage>
        <p>
          The action space was binary: <code>CHEAP</code> keeps the local completion; <code>EXPENSIVE</code> calls a stronger API model. Generation models remained frozen. Only the routing policy could learn.
        </p>
      </section>

      <section id="bandit">
        <p className="article-section-number">02</p>
        <h2>A cost-sensitive contextual bandit</h2>
        <p>
          I formulated the decision as a contextual bandit. The context contains the coding task, the cheap completion, its visible test score, and the error type. The policy chooses one action and receives a reward that balances hidden-test quality against normalized cost.
        </p>
        <Equation label="Routing objective">
          R(x, a) = s(x, a) − λ · c(a)
        </Equation>
        <p>
          Here, <code>s</code> is solution quality on tests the router cannot see, <code>c</code> is cost, and <code>λ</code> controls how much cost matters. At λ = 0, the objective only values quality. As λ increases, escalation needs a larger expected quality gain to be worthwhile.
        </p>
        <PlainLanguage>
          A contextual bandit is a one-decision reinforcement-learning problem. It sees the situation, chooses an action, and gets a score. Unlike a multi-step game, today’s action does not change a long future trajectory.
        </PlainLanguage>
      </section>

      <section id="evaluation">
        <p className="article-section-number">03</p>
        <h2>Visible tests for routing, hidden tests for truth</h2>
        <p>
          Evaluation used 427 MBPP-sanitized Python tasks. For each task, one assertion was visible to the router; the remaining assertions were hidden and used only for final scoring. Code ran in an isolated subprocess with a 10-second timeout.
        </p>
        <p>
          That separation is essential. If the router can see the same tests used to claim final quality, it can overfit the evaluation signal. A visible pass is evidence, not proof; hidden tests estimate whether the solution actually generalizes.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead><tr><th>Role</th><th>MBPP development</th><th>EvalPlus transfer</th></tr></thead>
            <tbody>
              <tr><td>Cheap model</td><td>Qwen2.5-Coder-7B</td><td>Qwen2.5-Coder-7B</td></tr>
              <tr><td>Strong model</td><td>Qwen 3.7 Max</td><td>Claude Sonnet 4.6</td></tr>
              <tr><td>Benchmarks</td><td>427 MBPP-sanitized</td><td>164 HumanEval+ · 378 MBPP+</td></tr>
              <tr><td>Quality</td><td>Hidden assertions</td><td>EvalPlus “plus” tests</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Cost was normalized so the average strong-model call equaled 1.0. The headline analysis treated local inference as zero API cost, then separately varied local cost from 0% to 20% of mean API cost.
        </p>
      </section>

      <section id="policies">
        <p className="article-section-number">04</p>
        <h2>From one-line rules to trained routers</h2>
        <p>The experiment compared policies at several levels of complexity:</p>
        <ul>
          <li><strong>Always local / always API:</strong> endpoints of the cost–quality curve.</li>
          <li><strong>Prompt-length heuristic:</strong> escalate tasks with longer prompts.</li>
          <li><strong>Cheap-then-escalate:</strong> keep a local answer only when it passes every visible test.</li>
          <li><strong>Logistic and ModernBERT routers:</strong> supervised classifiers with calibrated escalation thresholds.</li>
          <li><strong>Qwen3.5-0.8B LoRA router:</strong> a small language model fine-tuned to emit <code>LOCAL</code> or <code>API</code>.</li>
          <li><strong>REINFORCE:</strong> direct policy-gradient optimization, including warm starts from supervised checkpoints.</li>
          <li><strong>Hindsight oracle:</strong> an unattainable reference policy that knows both models’ hidden outcomes.</li>
        </ul>
        <p>
          The learned router’s labels came from oracle decisions under the cost-sensitive objective. Since both models’ outcomes were already logged for every task, supervised oracle imitation was a natural full-information baseline; exploration was not required to discover counterfactual rewards.
        </p>
        <PlainLanguage>
          LoRA adapts a model by training small low-rank parameter updates instead of every original weight. It reduces memory and compute, but it does not remove the need for calibration: the model’s score still needs a threshold that decides when to escalate.
        </PlainLanguage>
      </section>

      <section id="results">
        <p className="article-section-number">05</p>
        <h2>Executable feedback was the dominant signal</h2>
        <p>
          On MBPP, cheap-then-escalate reached a <strong>0.958 hidden pass rate</strong> at <strong>0.257 normalized cost</strong>, escalating only <strong>16.9%</strong> of tasks. It nearly matched the hindsight oracle and dominated prompt-only routers. Of 427 tasks, the two generation models tied on 343; the strong model strictly won on 82. Visible test failures identified much of that useful escalation set.
        </p>
        <p>
          The Qwen3.5-0.8B LoRA router could trace a competitive frontier. Its best reported point reached 0.961 pass rate at 0.224 cost. But performance varied across seeds and thresholds, and the model did not reliably beat the deterministic verifier rule.
        </p>
        <ArticleFigure
          src="/articles/model-routing-frontier.png"
          alt="Cost-quality frontier comparing local, API, verifier-rule, Qwen LoRA, and REINFORCE routing policies"
          caption="Held-out MBPP cost–quality frontier. Points farther up and left are better. The verifier rule sits close to learned-router operating points without their seed and calibration sensitivity."
        />
        <p>
          On held-out HumanEval+ and MBPP+, cheap-then-escalate reached the same or slightly higher point-estimate quality as always-Sonnet while using roughly <strong>19–23% of normalized API spend</strong>. The paired quality confidence intervals still included zero, so the careful claim is “no detected quality loss,” not universal equivalence.
        </p>
        <p>
          In a post-hoc MBPP+ analysis at λ = 0.125, reward improved by 0.099 with a paired 95% confidence interval of [0.069, 0.128], while normalized cost fell by 77.1%. The quality difference was 0.003 [−0.026, 0.029], clearing a three-point non-inferiority guardrail. Because that primary designation followed inspection of the course results, it needs prospective confirmation on fresh data.
        </p>
        <PlainLanguage>
          A confidence interval is a range of effects compatible with sampling variation. Here it rules out a large quality drop but still includes small positive and negative differences. That is why “we did not detect a loss” is more defensible than “the systems are identical.”
        </PlainLanguage>
      </section>

      <section id="audit">
        <p className="article-section-number">06</p>
        <h2>The scoring audit changed the story</h2>
        <p>
          During an audit, I found a right-padding bug in batched next-token scoring for the Qwen router. The implementation read logits at position <code>-1</code>. With right-padded inputs, that position belongs to padding for shorter prompts—not to their last real token.
        </p>
        <div className="padding-demo" aria-label="Right-padding scoring bug illustration">
          <div><span>long prompt</span><code>[ task · code · tests · API ]</code><b>✓ last token</b></div>
          <div><span>short prompt</span><code>[ task · tests · PAD · PAD ]</code><b className="bad">✕ padding</b></div>
        </div>
        <p>
          I changed the scorer to gather each sequence’s last non-padding position, added a regression test with unequal-length inputs, and re-evaluated all 23 stored supervised adapters. At λ = 0.125, five-seed escalation changed from a misleading <strong>27.9% ± 31.3%</strong> to <strong>20.6% ± 3.7%</strong>. What looked like severe training instability was largely an evaluation artifact.
        </p>
        <blockquote>An evaluation harness is part of the model. If its indexing is wrong, the scientific conclusion is wrong.</blockquote>
      </section>

      <section id="rl">
        <p className="article-section-number">07</p>
        <h2>Why REINFORCE struggled</h2>
        <p>
          Direct policy gradients were fragile in this offline, sparse-reward setting. At higher cost penalties, prompt-only REINFORCE collapsed to always-local: expensive-only wins were rare, and conservative behavior reinforced itself. At λ = 0 it over-escalated instead. Warm-starting from supervised LoRA checkpoints and reducing variance did not create a robust gain; the five-seed mean reward was slightly lower than supervised fine-tuning (0.923 versus 0.925).
        </p>
        <p>
          This is a useful boundary condition for reinforcement learning. Because the logged dataset contained outcomes for both actions on every task, supervised oracle imitation could use more direct information than sampled policy-gradient updates. RL machinery added variance without adding information.
        </p>
        <ArticleFigure
          src="/articles/model-routing-local-cost.png"
          alt="Sensitivity plots showing pass rate, cost, reward, and regret as local inference cost changes"
          caption="Local-cost sensitivity. The rule’s routing decisions and pass rate remain fixed because they depend on test outcomes; absolute cost and reward move as local inference is assigned a larger cost."
        />
      </section>

      <section id="takeaways">
        <p className="article-section-number">08</p>
        <h2>What I would deploy—and what remains open</h2>
        <p>
          The practical default is verifier-aware escalation: run a capable local model, execute a trustworthy visible check, and escalate failures. A learned router becomes interesting when the verifier is partial, latency matters, or the action space expands beyond two models—but it must be evaluated across seeds and recalibrated under distribution shift.
        </p>
        <ol>
          <li><strong>Exploit domain-native feedback first.</strong> An executable test was more informative than static prompt complexity.</li>
          <li><strong>Calibrate where the system will run.</strong> One MBPP-trained seed under-escalated on EvalPlus until its threshold was recalibrated.</li>
          <li><strong>Use RL when it adds information.</strong> Full offline outcomes favored supervised learning; multi-step or partially observed routing may change that calculation.</li>
          <li><strong>Audit the evaluator as aggressively as the policy.</strong> Padding, extraction, timeouts, and hidden reasoning-token accounting all affected apparent performance.</li>
        </ol>
        <p>
          The study remains scoped to Python unit-test benchmarks and binary routing. Future work should account for GPU-amortized local cost and latency, learn across multiple tiers (7B, 9B, API), train jointly across benchmarks, and test domains where verifiers are weaker than executable unit tests.
        </p>
      </section>
    </ArticleLayout>
  )
}
