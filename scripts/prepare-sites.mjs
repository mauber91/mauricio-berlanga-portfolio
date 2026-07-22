import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'

const serverDir = new URL('../dist/server/', import.meta.url)
const metadataDir = new URL('../dist/.openai/', import.meta.url)
const hostingSource = new URL('../.openai/hosting.json', import.meta.url)

await mkdir(serverDir, { recursive: true })
await mkdir(metadataDir, { recursive: true })
await copyFile(hostingSource, new URL('hosting.json', metadataDir))

const worker = `
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
      return textResponse(
        \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>\${url.origin}/</loc></url></urlset>\`,
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
      const html = (await response.text()).replaceAll('__SITE_ORIGIN__', url.origin)
      return new Response(html, { status: response.status, headers })
    }

    return response
  },
}
`

await writeFile(new URL('index.js', serverDir), worker.trimStart())

const hosting = JSON.parse(await readFile(hostingSource, 'utf8'))
if (!hosting.project_id) throw new Error('Missing Sites project_id')
