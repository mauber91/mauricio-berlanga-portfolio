import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'

const serverDir = new URL('../dist/server/', import.meta.url)
const metadataDir = new URL('../dist/.openai/', import.meta.url)
const hostingSource = new URL('../.openai/hosting.json', import.meta.url)

await mkdir(serverDir, { recursive: true })
await mkdir(metadataDir, { recursive: true })
await copyFile(hostingSource, new URL('hosting.json', metadataDir))

const worker = `
const articleMeta = {
  '/writing/usd-mxn-forecasting/': {
    title: 'When the baseline wins: lessons from forecasting USD/MXN — Mauricio Berlanga',
    description: 'A technical account of testing linear models, tree ensembles, and a neural network against autoregressive baselines on monthly USD/MXN data.',
    image: '/articles/usdmxn-social.png',
    imageAlt: 'The United States and Mexico overlaid with currency, forecasting, and machine-learning imagery.',
  },
  '/writing/verifier-aware-model-routing/': {
    title: 'Routing code generation with verifiers — Mauricio Berlanga',
    description: 'A cost-sensitive contextual-bandit study of routing code generation between local and stronger models using executable test feedback.',
  },
  '/writing/colmo/': {
    title: 'Cloud thinks, local reads: building COLMo — Mauricio Berlanga',
    description: 'A work-in-progress study of frontier-cloud supervision, local LLM execution, verification, cost, and privacy over long private documents.',
  },
}

function textResponse(body, contentType) {
  return new Response(body, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=3600',
    },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/robots.txt') {
      return textResponse(
        \`User-agent: *\\nAllow: /\\n\\nSitemap: \${url.origin}/sitemap.xml\\n\`,
        'text/plain; charset=UTF-8',
      )
    }

    if (url.pathname === '/sitemap.xml') {
      const paths = ['/', '/writing/usd-mxn-forecasting/', '/writing/verifier-aware-model-routing/', '/writing/colmo/']
      const entries = paths.map((path) => \`<url><loc>\${url.origin}\${path}</loc></url>\`).join('')
      return textResponse(
        \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\${entries}</urlset>\`,
        'application/xml; charset=UTF-8',
      )
    }

    let response = await env.ASSETS.fetch(request)

    if (response.status === 404 && request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
      response = await env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
    }

    if (response.headers.get('content-type')?.includes('text/html')) {
      const headers = new Headers(response.headers)
      headers.set('cache-control', 'public, max-age=300')
      const pathname = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/'
      const meta = articleMeta[pathname]
      let html = (await response.text()).replaceAll('__SITE_ORIGIN__', url.origin)

      if (meta) {
        html = html
          .replace(/<title>[^<]*<\\/title>/, \`<title>\${meta.title}</title>\`)
          .replace(/<meta name="description" content="[^"]*" [/]>/, \`<meta name="description" content="\${meta.description}" />\`)
          .replace(/<meta property="og:title" content="[^"]*" [/]>/, \`<meta property="og:title" content="\${meta.title}" />\`)
          .replace(/<meta property="og:description" content="[^"]*" [/]>/, \`<meta property="og:description" content="\${meta.description}" />\`)
          .replace(/<meta name="twitter:title" content="[^"]*" [/]>/, \`<meta name="twitter:title" content="\${meta.title}" />\`)
          .replace(/<meta name="twitter:description" content="[^"]*" [/]>/, \`<meta name="twitter:description" content="\${meta.description}" />\`)
          .replace(/<meta property="og:image" content="[^"]*" [/]>/, \`<meta property="og:image" content="\${url.origin}\${meta.image || '/og.png'}" />\`)
          .replace(/<meta property="og:image:alt" content="[^"]*" [/]>/, \`<meta property="og:image:alt" content="\${meta.imageAlt || 'Mauricio Berlanga — Engineering systems that learn, reason, and perform.'}" />\`)
          .replace(/<meta name="twitter:image" content="[^"]*" [/]>/, \`<meta name="twitter:image" content="\${url.origin}\${meta.image || '/og.png'}" />\`)
          .replace(/<meta name="twitter:image:alt" content="[^"]*" [/]>/, \`<meta name="twitter:image:alt" content="\${meta.imageAlt || 'Mauricio Berlanga — Engineering systems that learn, reason, and perform.'}" />\`)
          .replace(/<link rel="canonical" href="[^"]*" [/]>/, \`<link rel="canonical" href="\${url.origin}\${pathname}" />\`)
      }

      return new Response(html, { status: response.status, headers })
    }

    return response
  },
}
`

await writeFile(new URL('index.js', serverDir), worker.trimStart())

const hosting = JSON.parse(await readFile(hostingSource, 'utf8'))
if (!hosting.project_id) throw new Error('Missing Sites project_id')
