import { mkdir, readFile, writeFile } from 'node:fs/promises'

const output = new URL('../dist/', import.meta.url)
const siteUrl = 'https://mauber91.github.io/mauricio-berlanga-portfolio'
const routes = [
  {
    path: '/writing/usd-mxn-forecasting/',
    title: 'When the baseline wins: lessons from forecasting USD/MXN — Mauricio Berlanga',
    description: 'A technical account of testing linear models, tree ensembles, and a neural network against autoregressive baselines on monthly USD/MXN data.',
    image: '/articles/usdmxn-social.png',
    imageAlt: 'The United States and Mexico overlaid with currency, forecasting, and machine-learning imagery.',
  },
  {
    path: '/writing/verifier-aware-model-routing/',
    title: 'Routing code generation with verifiers — Mauricio Berlanga',
    description: 'A cost-sensitive contextual-bandit study of routing code generation between local and stronger models using executable test feedback.',
  },
  {
    path: '/writing/colmo/',
    title: 'Cloud thinks, local reads: building COLMo — Mauricio Berlanga',
    description: 'A work-in-progress study of frontier-cloud supervision, local LLM execution, verification, cost, and privacy over long private documents.',
  },
]

const builtIndex = await readFile(new URL('index.html', output), 'utf8')
const rootIndex = builtIndex.replaceAll('__SITE_ORIGIN__', siteUrl)
await writeFile(new URL('index.html', output), rootIndex)
await writeFile(new URL('404.html', output), rootIndex)
await writeFile(new URL('.nojekyll', output), '')

for (const route of routes) {
  const routeDirectory = new URL(`.${route.path}`, output)
  await mkdir(routeDirectory, { recursive: true })
  const html = rootIndex
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${route.description}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${siteUrl}${route.image ?? '/og.png'}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${route.imageAlt ?? 'Mauricio Berlanga — Engineering systems that learn, reason, and perform.'}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${siteUrl}${route.image ?? '/og.png'}" />`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*" \/>/, `<meta name="twitter:image:alt" content="${route.imageAlt ?? 'Mauricio Berlanga — Engineering systems that learn, reason, and perform.'}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${siteUrl}${route.path}" />`)
  await writeFile(new URL('index.html', routeDirectory), html)
}

const sitemapEntries = ['/', ...routes.map((route) => route.path)]
  .map((path) => `<url><loc>${siteUrl}${path}</loc></url>`)
  .join('')
await writeFile(
  new URL('sitemap.xml', output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}</urlset>`,
)
await writeFile(
  new URL('robots.txt', output),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
)
