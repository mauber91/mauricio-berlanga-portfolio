import { Equation, PlainLanguage } from './ArticleElements'
import { ArticleLayout } from './ArticleLayout'
import type { ArticleMeta } from '../../data/articles'

const sections = [
  { id: 'result', label: 'The result, carefully stated' },
  { id: 'target', label: 'Predict probabilities, not picks' },
  { id: 'strength', label: 'Building a strength prior' },
  { id: 'scorelines', label: 'From strength to scorelines' },
  { id: 'simulation', label: 'Simulating the tournament' },
  { id: 'why-it-worked', label: 'Why three calls survived' },
  { id: 'evaluation', label: 'What 3 of 4 does not prove' },
  { id: 'lessons', label: 'What I would keep' },
]

export function WcForecastArticle({ article }: { article: ArticleMeta }) {
  return (
    <ArticleLayout
      article={article}
      sections={sections}
      stats={[
        { value: '3 / 4', label: 'Semifinalists identified' },
        { value: '48', label: 'Teams modeled' },
        { value: '10k–1m', label: 'Trials per forecast' },
        { value: '104', label: 'Matches in the bracket' },
      ]}
    >
      <p className="article-lead">
        My World Cup model identified three of the four eventual semifinalists. The useful part of that result was not the bracket screenshot. It was the pipeline underneath it: estimate each team’s strength, turn a matchup into a distribution of plausible scores, and simulate the entire tournament often enough to see which paths survive uncertainty.
      </p>

      <section id="result">
        <p className="article-section-number">01</p>
        <h2>The result, carefully stated</h2>
        <p>
          Before the semifinal field was complete, the saved projection contained three teams that made it: <strong>Spain, France, and Argentina</strong>. The fourth call missed; England took the remaining place. That is a 75% hit rate on four slots, but it is not evidence that the system can predict football with 75% accuracy.
        </p>
        <p>
          A semifinal call is the end of a chain. A team must land in a particular group position, receive an opponent through the official bracket rules, and then win several dependent knockout matches. One upset changes not only one prediction but the path available to every team downstream. The result therefore evaluates a tournament model, not four independent yes-or-no guesses.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead><tr><th>Semifinal call</th><th>Outcome</th><th>What the model got right</th></tr></thead>
            <tbody>
              <tr><td>Spain</td><td>Reached</td><td>High prior strength held across its knockout path</td></tr>
              <tr><td>France</td><td>Reached</td><td>Quality remained robust across many simulated pairings</td></tr>
              <tr><td>Argentina</td><td>Reached</td><td>Strong advancement probability survived bracket variance</td></tr>
              <tr><td>Fourth projected team</td><td>Missed</td><td>The path was less stable than the single bracket implied</td></tr>
            </tbody>
          </table>
        </div>
        <PlainLanguage>
          Three of four is the outcome of one tournament. The more informative artifact is the frozen forecast: its input cutoff, random seed, model and ruleset versions, and the probability assigned to every stage.
        </PlainLanguage>
      </section>

      <section id="target">
        <p className="article-section-number">02</p>
        <h2>Predict probabilities first; derive the bracket second</h2>
        <p>
          I did not begin by asking the model to name a champion. I asked a smaller question for every possible matchup: how likely are a regulation win, a draw, and a loss? Those probabilities become score distributions; score distributions become tournament trials; the bracket shown by the app is only one readable summary of the resulting sample.
        </p>
        <div className="article-pipeline" aria-label="World Cup prediction pipeline">
          <div><b>01</b><span>Team strength</span><small>Elo · FIFA · markets</small></div>
          <div><b>02</b><span>Expected goals</span><small>Quality · venue · rest · travel</small></div>
          <div><b>03</b><span>Score matrix</span><small>Negative binomial · 1X2</small></div>
          <div><b>04</b><span>Tournament trial</span><small>Groups · tie-breaks · knockouts</small></div>
          <div><b>05</b><span>Stage probability</span><small>Reach SF · final · champion</small></div>
        </div>
        <Equation label="Monte Carlo estimate">
          P̂(team reaches SF) = semifinal appearances / N trials
        </Equation>
        <p>
          This matters because “most likely” is not the same as “likely.” A team can lead its branch with a 30% semifinal probability while the combined probability of everyone else is 70%. The projected bracket chooses a coherent path through the probability tree; it does not pretend that path is certain.
        </p>
      </section>

      <section id="strength">
        <p className="article-section-number">03</p>
        <h2>Start with a conservative team-strength prior</h2>
        <p>
          The backbone was World Football Elo. Elo is useful here because it expresses relative team quality on a scale designed for head-to-head competition and can be updated after each result. I blended it lightly with FIFA ranking and, when available, the market-implied probability of winning the tournament.
        </p>
        <Equation label="Fused strength">
          Eᶠⁱᶠᵃ(r) = 2200 − 15r ··· S = 0.94Eˡᶦᵛᵉ + 0.06Eᶠⁱᶠᵃ
        </Equation>
        <p>
          An available champion market added another small, 8% adjustment on an Elo-equivalent scale. The weights were deliberately asymmetric: live Elo supplied most of the prior; rankings and markets nudged it. That reduced sensitivity to any single noisy source while still letting independent information move the forecast.
        </p>
        <p>
          Each Monte Carlo trial also perturbed the baseline strength with Gaussian uncertainty. The default standard deviation was 35 Elo points and widened for confederations with less frequent top-tier competitive data. That prevented the simulator from treating every rating as an exact fact.
        </p>
        <Equation label="Within-tournament Elo update">
          E′ₐ = Eₐ + 32 · margin · (resultₐ − expectedₐ)
        </Equation>
        <PlainLanguage>
          The model did not say “Argentina is a 2,050-strength team forever.” It said “2,050 is my current center of belief,” sampled uncertainty around it, and moved that belief when simulated or official results supplied new evidence.
        </PlainLanguage>
      </section>

      <section id="scorelines">
        <p className="article-section-number">04</p>
        <h2>Turn strength into a distribution of scores</h2>
        <p>
          A strength gap alone cannot run a tournament. I converted it into expected goals for both sides. The log goal rate started at 1.32 goals per team, then shifted with the Elo difference, venue-specific host advantage, rest, and travel distance. Rest saturated after four days and travel after 3,500 kilometers so neither effect could grow without bound.
        </p>
        <Equation label="Expected goals">
          λₐ = clip(exp(log 1.32 + ½ΔE + context), 0.15, 4.5)
        </Equation>
        <p>
          Football scores vary more than a plain Poisson model often allows, so the production model used a negative-binomial marginal. With dispersion φ = 0.15, its variance is <code>λ + φλ²</code>. I built an 11×11 joint score matrix, folded the remaining tail into the last row and column, and summed its cells into home win, draw, and away win probabilities.
        </p>
        <Equation label="Scoreline model">
          P(A=i, B=j) ∝ NB(i | λₐ, φ) · NB(j | λᵦ, φ)
        </Equation>
        <h3>Markets were calibration, not an oracle</h3>
        <p>
          When real bookmaker or prediction-market quotes existed, I removed the vig by normalizing inverse decimal odds. The model and market were then combined in log-probability space—a weighted geometric mean—with a default 85% weight toward external market information. The score matrix was reweighted to match those final 1X2 margins while preserving the relative shape of scorelines inside each outcome class.
        </p>
        <Equation label="Log-probability pool">
          qₖ ∝ pₘₐᵣₖₑₜ,ₖ⁰·⁸⁵ · pₘₒdₑₗ,ₖ⁰·¹⁵
        </Equation>
        <p>
          During the tournament, FIFA post-match reports added a small tactical layer. Lagged team profiles represented possession, verticality, pressing, width, chance quality, and six matchup interactions. A ridge model learned residual tendencies, but tactical adjustments to expected goals were clamped to ±0.20. The style layer could nudge the Elo anchor; it could not replace it after a few matches.
        </p>
      </section>

      <section id="simulation">
        <p className="article-section-number">05</p>
        <h2>Simulate the rules, not just the matches</h2>
        <p>
          This was the most important engineering choice. A list of match probabilities is not a World Cup forecast. Every trial had to reproduce the tournament’s state transitions from the current official table to the final.
        </p>
        <ol>
          <li><strong>Freeze known information.</strong> Completed results were locked; only future fixtures were sampled.</li>
          <li><strong>Play the groups.</strong> Each remaining score came from its calibrated matrix.</li>
          <li><strong>Model matchday-three incentives.</strong> Clinched or eliminated teams could rotate, and mutually beneficial draws received extra probability mass.</li>
          <li><strong>Apply the actual ranking rules.</strong> Group ordering used FIFA’s head-to-head tie-break sequence rather than a simplified points-and-goal-difference shortcut.</li>
          <li><strong>Resolve third-place paths.</strong> The eight qualifying third-place teams were assigned through the complete 495-option Annex C matrix.</li>
          <li><strong>Play every knockout.</strong> A regulation draw triggered extra time with 30% of the normal goal rate; a second draw went to a probabilistic shootout.</li>
        </ol>
        <p>
          The simulator repeated that process in deterministic chunks for 10,000, 100,000, or 1,000,000 trials. Each run stored its seed, inputs, cutoff, ruleset, engine version, and content hash. Changing worker count did not change the result because every chunk received a deterministic child seed.
        </p>
        <blockquote>A trustworthy forecast is a frozen probability distribution plus the rules that transformed it—not a screenshot captured after the fact.</blockquote>
      </section>

      <section id="why-it-worked">
        <p className="article-section-number">06</p>
        <h2>Why three semifinal calls survived</h2>
        <p>
          The successful calls shared a useful property: they were not dependent on one brittle score prediction. Spain, France, and Argentina remained strong across many sampled opponents and scorelines. Their advancement probability came from repeated survival under slightly different strength estimates, group orders, and knockout paths.
        </p>
        <ul>
          <li><strong>Strong priors were allowed to stay strong.</strong> The model did not overreact to a single recent match or a handful of tactical features.</li>
          <li><strong>Uncertainty entered early.</strong> Perturbing ratings before playing the tournament propagated epistemic uncertainty through the bracket.</li>
          <li><strong>Draw mechanics were explicit.</strong> Regulation, extra time, and penalties did not collapse into a generic binary win probability.</li>
          <li><strong>Path probability mattered.</strong> The model valued a team’s route as well as its isolated quality.</li>
          <li><strong>New evidence updated, rather than rewrote, the prior.</strong> Live Elo and bounded style effects rewarded performance without chasing noise.</li>
        </ul>
        <p>
          The missed fourth team is equally informative. A single displayed bracket hides how close neighboring paths can be. If two teams reach the semifinal in 24% and 22% of trials, choosing the first is necessary to draw a bracket, but the two-point difference should not be narrated as confidence.
        </p>
      </section>

      <section id="evaluation">
        <p className="article-section-number">07</p>
        <h2>What 3 of 4 does not prove</h2>
        <p>
          It is tempting to treat the semifinal result as the evaluation. I do not. Four slots are too few, elite teams begin with strong base rates, and bracket outcomes are correlated. A favorite can lose despite a well-calibrated 70% win probability; an underdog can win without falsifying the model.
        </p>
        <p>
          The repository therefore evaluates match probabilities with walk-forward tests. For each completed group match, the model reconstructs ratings using only earlier results and scores the untouched prediction with <strong>log loss</strong>, <strong>Brier score</strong>, <strong>ranked probability score</strong>, and <strong>expected calibration error</strong>. These metrics reward honest probabilities, not only the most likely label.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead><tr><th>Metric</th><th>Question it answers</th><th>Failure it exposes</th></tr></thead>
            <tbody>
              <tr><td>Log loss</td><td>How much probability reached the actual result?</td><td>Confidently wrong forecasts</td></tr>
              <tr><td>Brier score</td><td>How far was the full probability vector from reality?</td><td>Poor overall probability accuracy</td></tr>
              <tr><td>Ranked probability score</td><td>How wrong was an ordered win/draw/loss forecast?</td><td>Ignoring outcome distance</td></tr>
              <tr><td>Calibration error</td><td>Did 60% calls happen about 60% of the time?</td><td>Systematic overconfidence</td></tr>
            </tbody>
          </table>
        </div>
        <PlainLanguage>
          Picking the right team and assigning it 51% is different from assigning 95%. Both count as a correct label; only a proper scoring rule records how much confidence the model risked.
        </PlainLanguage>
      </section>

      <section id="lessons">
        <p className="article-section-number">08</p>
        <h2>What I would keep for the next tournament</h2>
        <p>
          The biggest lesson was architectural, but not about React. Separate strength estimation, match generation, rules, and simulation so each layer can be tested and replaced independently. A better rating source should not require rewriting tie-break logic; a corrected tournament rule should not change the probability model.
        </p>
        <ol>
          <li><strong>Version every forecast.</strong> Inputs and cutoff times matter as much as model code.</li>
          <li><strong>Keep the simple prior dominant.</strong> Small live datasets justify bounded adjustments, not wholesale relearning.</li>
          <li><strong>Backtest probabilities chronologically.</strong> Tournament hit rates are compelling stories but weak sample sizes.</li>
          <li><strong>Show distributions beside picks.</strong> A bracket is legible; the uncertainty behind it is the actual result.</li>
          <li><strong>Implement the real competition.</strong> Tie-breaks, third-place assignments, rest, venue, and path dependence are part of the model.</li>
        </ol>
        <p>
          Predicting three semifinalists was satisfying. Building a system that can explain what it knew, when it knew it, and how uncertain it was is the part I would reuse.
        </p>
      </section>
    </ArticleLayout>
  )
}
