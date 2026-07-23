import { readFile } from 'node:fs/promises'

const cardPaths = [
  '../public/articles/usdmxn-card-v2.jpg',
  '../public/articles/model-routing-card-v2.jpg',
  '../public/articles/colmo-card-v2.jpg',
]

function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return undefined

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ])

  let offset = 2
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    if (startOfFrameMarkers.has(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      }
    }

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2
      continue
    }

    const segmentLength = buffer.readUInt16BE(offset + 2)
    if (segmentLength < 2) break
    offset += segmentLength + 2
  }

  return undefined
}

for (const relativePath of cardPaths) {
  const cardUrl = new URL(relativePath, import.meta.url)
  const buffer = await readFile(cardUrl)
  const dimensions = jpegDimensions(buffer)

  if (!dimensions) throw new Error(`Could not read JPEG dimensions for ${relativePath}`)
  if (dimensions.width !== 1200 || dimensions.height !== 630) {
    throw new Error(`${relativePath} must be 1200x630; received ${dimensions.width}x${dimensions.height}`)
  }
  if (buffer.byteLength >= 5 * 1024 * 1024) {
    throw new Error(`${relativePath} must be smaller than 5 MB`)
  }

  console.log(`social card ok: ${relativePath} (${dimensions.width}x${dimensions.height})`)
}
