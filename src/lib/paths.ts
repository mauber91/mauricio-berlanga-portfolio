const basePath = import.meta.env.BASE_URL

export function sitePath(path: string) {
  if (/^(?:[a-z]+:|#)/i.test(path)) return path
  return `${basePath}${path.replace(/^\//, '')}`
}

export function stripSiteBase(pathname: string) {
  const normalizedBase = basePath === '/' ? '' : basePath.replace(/\/$/, '')
  if (!normalizedBase) return pathname
  if (pathname === normalizedBase) return '/'
  return pathname.startsWith(`${normalizedBase}/`) ? pathname.slice(normalizedBase.length) : pathname
}
