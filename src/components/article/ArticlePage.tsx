import type { ArticleMeta } from '../../data/articles'
import { Cs224rArticle } from './Cs224rArticle'
import { Cs229Article } from './Cs229Article'
import { ColmoArticle } from './ColmoArticle'
import { OneSourceArticle } from './OneSourceArticle'
import { WcForecastArticle } from './WcForecastArticle'

export function ArticlePage({ article }: { article: ArticleMeta }) {
  if (article.slug === 'usd-mxn-forecasting') return <Cs229Article article={article} />
  if (article.slug === 'colmo') return <ColmoArticle article={article} />
  if (article.slug === 'world-cup-semifinal-forecast') return <WcForecastArticle article={article} />
  if (article.slug === 'onesource-decision-record') return <OneSourceArticle article={article} />
  return <Cs224rArticle article={article} />
}
