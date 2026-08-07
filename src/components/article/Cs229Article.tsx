import { ArticleFigure, Equation, PlainLanguage } from './ArticleElements'
import { ArticleLayout } from './ArticleLayout'
import type { ArticleMeta } from '../../data/articles'

const sections = [
  { id: 'question', label: 'The question' },
  { id: 'data', label: 'Data and evaluation' },
  { id: 'models', label: 'Models and baselines' },
  { id: 'results', label: 'What happened' },
  { id: 'failure-modes', label: 'Why complexity lost' },
  { id: 'lessons', label: 'Engineering lessons' },
  { id: 'next', label: 'What I would test next' },
]

export function Cs229Article({ article }: { article: ArticleMeta }) {
  return (
    <ArticleLayout
      article={article}
      sections={sections}
      stats={[
        { value: '2000–24', label: 'Monthly data window' },
        { value: '0.600', label: 'Best raw accuracy' },
        { value: '20', label: 'Direction features' },
        { value: 'AR(1)', label: 'Best balanced model' },
      ]}
    >
      <p className="article-lead">
        This project began with an optimistic question: could modern machine-learning models find useful cross-border signal in U.S. financial conditions and forecast the next monthly move in USD/MXN? The real-data rerun found no robust directional winner: XGBoost posted the highest raw accuracy, while a one-lag AR rule retained the strongest balanced accuracy.
      </p>

      <section id="question">
        <p className="article-section-number">01</p>
        <h2>The question behind the project</h2>
        <p>
          Exchange rates react to monetary policy, inflation expectations, growth, risk appetite, and information that reaches markets at different speeds. Because the United States and Mexico are tightly linked, it is reasonable to ask whether U.S. Treasury yields, yield-curve slopes, inflation, unemployment, and the Federal Funds rate contain advance information about the peso.
        </p>
        <p>
          I tested two related tasks. The first was <strong>level forecasting</strong>: predict next month’s USD/MXN exchange-rate level. The second was <strong>direction classification</strong>: predict whether the next monthly log return would be positive or negative.
        </p>
        <Equation label="Monthly return">
          rₜ = log(FXₜ) − log(FXₜ₋₁)
        </Equation>
        <PlainLanguage>
          A level forecast asks “what number comes next?” Direction classification asks the simpler-sounding question “up or down?” The second task is not necessarily easier: removing magnitude also removes useful information, and noisy movements can dominate the label.
        </PlainLanguage>
      </section>

      <section id="data">
        <p className="article-section-number">02</p>
        <h2>A time-series split that respects time</h2>
        <p>
          The monthly panel covered 2000 through 2024. I trained on 2000–2015 (192 samples), selected hyperparameters on 2016–2019 (48 samples), and evaluated once on 2020–2024 (60 samples). All normalization statistics came from the training period.
        </p>
        <div className="article-split" aria-label="Chronological data split">
          <div style={{ flex: 192 }}><b>Train</b><span>2000–2015 · 192</span></div>
          <div style={{ flex: 48 }}><b>Validation</b><span>2016–2019 · 48</span></div>
          <div style={{ flex: 60 }}><b>Test</b><span>2020–2024 · 60</span></div>
        </div>
        <p>
          Chronology matters. Random cross-validation would let the model train on observations that occur after some validation examples. In finance, where regimes shift and nearby observations are correlated, that can produce an unrealistically favorable estimate.
        </p>
        <h3>Features</h3>
        <p>
          Level forecasts used 3-month, 2-year, and 10-year Treasury yields; 10y–2y and 10y–3m slopes; year-over-year CPI inflation; unemployment; the Federal Funds rate; and six lagged USD/MXN levels. Direction models added three lagged returns and used a compact 20-column representation to limit redundancy.
        </p>
        <PlainLanguage>
          A lag is simply an earlier observation. “FX lag 1” is last month’s exchange rate; “return lag 2” is the return from two months ago. Lags give a model memory without assuming it can see the future.
        </PlainLanguage>
      </section>

      <section id="models">
        <p className="article-section-number">03</p>
        <h2>Complex models need simple opponents</h2>
        <p>
          I compared linear regression, logistic regression, a linear support-vector machine, random forests, XGBoost, and a two-hidden-layer multilayer perceptron. Trees were kept shallow; the direction network used 16- and 8-unit hidden layers with early stopping.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead><tr><th>Family</th><th>What it can capture</th><th>Main risk here</th></tr></thead>
            <tbody>
              <tr><td>Linear / logistic</td><td>Additive relationships</td><td>Misses nonlinear structure</td></tr>
              <tr><td>SVM</td><td>Maximum-margin boundary</td><td>Little signal to separate</td></tr>
              <tr><td>Random forest</td><td>Nonlinear interactions</td><td>Variance with small data</td></tr>
              <tr><td>XGBoost</td><td>Sequentially corrected trees</td><td>Fits noise aggressively</td></tr>
              <tr><td>2-layer MLP</td><td>Flexible nonlinear mapping</td><td>Memorization under 200 samples</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The critical comparison was not model versus model. It was every model versus a <strong>last-value or AR(1) baseline</strong>. For direction, the AR rule predicts that the sign of the next return will match the previous return—a one-step momentum assumption.
        </p>
        <Equation label="Direction baseline">
          sign(r̂ₜ₊₁) = 1[rₜ &gt; 0]
        </Equation>
      </section>

      <section id="results">
        <p className="article-section-number">04</p>
        <h2>The ranking changed; the diagnosis did not</h2>
        <p>
          The reproducible rerun focused on direction classification using a real monthly panel built directly from public FRED series. Earlier level-forecasting runs used development datasets, so I treat those results as exploratory rather than final evidence.
        </p>
        <p>
          Classifier thresholds were selected on the 2016–2019 validation period and frozen before the 2020–2024 test. XGBoost reached the highest raw accuracy at <strong>0.600</strong>, followed by logistic regression and random forest at <strong>0.583</strong>. The AR(1) rule reached <strong>0.567</strong>.
        </p>
        <p>
          Those bars do not tell the whole story. Random forest predicted “down” in all 60 months, and XGBoost predicted “up” only five times. AR(1) produced more balanced calls and achieved the best balanced accuracy: <strong>0.554</strong>, compared with XGBoost’s 0.531. The apparent winner therefore depends on whether the metric rewards majority-class accuracy or performance across both directions.
        </p>
        <ArticleFigure
          src="/articles/usdmxn-direction-accuracy.png"
          alt="Bar chart comparing directional accuracy across machine-learning models and the AR direction baseline"
          caption="Validation-thresholded test accuracy. XGBoost had the highest raw score, but confusion matrices revealed severe class collapse; AR(1) retained the strongest balanced accuracy."
        />
        <PlainLanguage>
          ROC–AUC measures whether a classifier ranks positive examples ahead of negative ones across all thresholds. A value near 0.5 means its scores order the two classes about as well as random guessing—even if one chosen threshold happens to give a passable accuracy.
        </PlainLanguage>
      </section>

      <section id="failure-modes">
        <p className="article-section-number">05</p>
        <h2>Why more capacity did not create more signal</h2>
        <p>
          The failure was not one bug or one bad hyperparameter. It was the interaction of a difficult target with a constrained dataset. Monthly macro variables are slow-moving, while exchange rates absorb global news and repricing quickly. Relationships estimated through 2015 also faced a very different test regime beginning in 2020.
        </p>
        <ul>
          <li><strong>Low sample size:</strong> fewer than 200 training rows made flexible models unstable.</li>
          <li><strong>Feature-to-signal mismatch:</strong> macro fundamentals may matter economically without predicting the next monthly return.</li>
          <li><strong>Regime changes:</strong> relationships learned in 2000–2015 need not hold in 2020–2024.</li>
          <li><strong>Class collapse:</strong> when features carry little directional information, minimizing loss can favor a near-constant majority prediction.</li>
        </ul>
        <p>
          Early versions used roughly 40–50 macro features and looked much stronger in-sample. Reducing the direction matrix to 20 carefully selected columns, limiting tree depth, using early stopping, and removing collinear series improved stability—but did not manufacture balanced out-of-sample signal.
        </p>
      </section>

      <section id="lessons">
        <p className="article-section-number">06</p>
        <h2>What this changed in how I evaluate ML systems</h2>
        <p>
          The practical lesson was not that machine learning is useless for foreign exchange. It was that model sophistication—and even the highest accuracy bar—is not evidence of useful behavior. A strong experiment makes the failure mode inspectable.
        </p>
        <ol>
          <li><strong>Make the baseline part of the design.</strong> A model has to beat the cheapest credible decision rule, not just another complex model.</li>
          <li><strong>Protect the timeline.</strong> Leakage-free chronological evaluation is more valuable than an impressive cross-validation score.</li>
          <li><strong>Inspect failure behavior.</strong> Confusion matrices and prediction traces exposed majority collapse and excessive smoothing that a single headline metric hid.</li>
          <li><strong>Treat negative results as information.</strong> The experiment narrowed where useful signal probably is not: monthly U.S. macro features alone.</li>
        </ol>
        <blockquote>A higher accuracy bar can still hide a one-class model.</blockquote>
      </section>

      <section id="next">
        <p className="article-section-number">07</p>
        <h2>What I would test next</h2>
        <p>
          A stronger follow-up would change the information set before changing the architecture: daily or weekly data, option-implied volatility, VIX, oil prices, positioning, and market microstructure signals. State-space or Bayesian models could represent structural breaks explicitly. Sequence models would only become credible with substantially more observations.
        </p>
        <p>
          The broader research question remains useful: under what data frequency and market regime do fundamentals add incremental value over price history? This project found limited, unstable monthly signal and showed why accuracy, balanced accuracy, score ranking, and confusion matrices must be interpreted together.
        </p>
      </section>
    </ArticleLayout>
  )
}
