import type { ArticleMeta } from '../../data/articles'
import { Cs224rArticle } from './Cs224rArticle'
import { Cs229Article } from './Cs229Article'
import { ColmoArticle } from './ColmoArticle'

export function ArticlePage({ article }: { article: ArticleMeta }) {
  if (article.slug === 'usd-mxn-forecasting') return <Cs229Article article={article} />
  if (article.slug === 'colmo') return <ColmoArticle article={article} />
  return <Cs224rArticle article={article} />
}
