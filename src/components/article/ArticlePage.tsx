import type { ArticleMeta } from '../../data/articles'
import { Cs224rArticle } from './Cs224rArticle'
import { Cs229Article } from './Cs229Article'

export function ArticlePage({ article }: { article: ArticleMeta }) {
  if (article.slug === 'usd-mxn-forecasting') return <Cs229Article article={article} />
  return <Cs224rArticle article={article} />
}
