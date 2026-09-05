import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ButtonLink } from '@/components/ui'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex min-h-svh items-center bg-paper">
      <div className="shell max-w-xl py-16">
        <h1 className="text-title">{isNotFound ? 'That page is not here' : 'Something went wrong'}</h1>
        <p className="prose-reading mt-4">
          {isNotFound
            ? 'The link may be old or mistyped. Everything we sell is one step from the shop.'
            : 'The page hit an error it could not recover from. Reloading usually fixes it; if not, the shop still works.'}
        </p>
        {!isNotFound && error instanceof Error && (
          <pre className="mt-4 overflow-x-auto border border-rule bg-white p-3 text-xs text-ink-soft">{error.message}</pre>
        )}
        <div className="mt-8 flex gap-3">
          <ButtonLink to="/" variant="ink">
            Go home
          </ButtonLink>
          <ButtonLink to="/shop" variant="outline">
            Go to the shop
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
