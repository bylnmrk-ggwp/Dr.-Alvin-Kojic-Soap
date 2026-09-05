import { PageMeta } from '@/components/common/PageMeta'
import { ButtonLink, EmptyState } from '@/components/ui'

export default function NotFoundPage() {
  return (
    <div className="shell py-16">
      <PageMeta title="Page not found" />
      <EmptyState
        title="That page is not here"
        description="The link may be old, or the address was typed differently. Everything we sell is one step from the shop."
        action={<ButtonLink to="/shop">Go to the shop</ButtonLink>}
      />
    </div>
  )
}
