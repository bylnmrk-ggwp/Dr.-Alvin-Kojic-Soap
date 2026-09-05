import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Renders the small subset of markdown the assistant is asked to use:
 * paragraphs, "- " bullet lists, **bold**, and [label](/path) links.
 * Internal paths become router links; anything else opens in a new tab.
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split('\n')
        const isList = lines.every((line) => /^[-*•]\s+/.test(line))
        if (isList) {
          return (
            <ul key={index} className="my-2 grid list-disc gap-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^[-*•]\s+/, ''))}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className="my-2 first:mt-0 last:mb-0">
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const [, label, href] = link
      const className =
        'font-medium text-violet underline decoration-violet/30 underline-offset-[3px] hover:decoration-violet'
      if (href.startsWith('/')) {
        return (
          <Link key={index} to={href} className={className}>
            {label}
          </Link>
        )
      }
      return (
        <a key={index} href={href} target="_blank" rel="noreferrer" className={className}>
          {label}
        </a>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}
