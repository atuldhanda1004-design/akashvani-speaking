'use client'

/**
 * Renders news text with:
 * - real line breaks / paragraphs
 * - clickable http/https links
 */
export default function NewsBody({ text = '', className = '' }) {
  if (!text) return null

  // Split into paragraphs by blank lines, keep single newlines too
  const paragraphs = String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-base text-gray-800 font-yantramanav leading-relaxed whitespace-pre-wrap break-words"
        >
          {linkify(para)}
        </p>
      ))}
    </div>
  )
}

function linkify(text) {
  // URLs + www.
  const regex =
    /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi
  const parts = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      )
    }

    let href = match[0]
    // strip trailing punctuation often stuck to URLs
    let trailing = ''
    const m = href.match(/[),.;!?]+$/)
    if (m) {
      trailing = m[0]
      href = href.slice(0, -trailing.length)
    }

    const fullHref = href.startsWith('http') ? href : `https://${href}`

    parts.push(
      <a
        key={`a-${key++}`}
        href={fullHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary font-semibold underline break-all hover:text-brand-secondary"
      >
        {href}
      </a>
    )

    if (trailing) {
      parts.push(<span key={`p-${key++}`}>{trailing}</span>)
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>)
  }

  return parts.length ? parts : text
}

/** For a single line / bullet that may contain links + internal newlines */
export function NewsInline({ text = '', className = '' }) {
  if (!text) return null
  return (
    <span className={`whitespace-pre-wrap break-words ${className}`}>
      {linkify(String(text).replace(/\r\n/g, '\n'))}
    </span>
  )
}