import type { ReactNode } from 'react'

/** An empty screen is an invitation to act, so it always carries an action. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h3 className="text-heading">{title}</h3>
      <p className="prose-reading mx-auto mt-3">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
