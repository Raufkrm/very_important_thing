export const normalizeValue = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ')

export const sha256 = async (value) => {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
