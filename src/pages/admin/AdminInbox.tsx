import { useState, type ReactNode } from 'react'
import {
  applicationStatusLabels,
  useContactMessages,
  useDistributorApplications,
  useUpdateApplicationStatus,
} from '@/features/admin/admin.queries'
import { StatusSelect } from '@/features/admin/components/StatusSelect'
import { Badge, EmptyState, Skeleton } from '@/components/ui'
import { cn, formatDateTime } from '@/lib/utils'
import type { ContactMessage } from '@/features/admin/admin.api'
import type { DistributorApplication, DistributorApplicationStatus } from '@/types'

type Tab = 'messages' | 'applications'

export default function AdminInbox() {
  const [tab, setTab] = useState<Tab>('messages')
  const messages = useContactMessages()
  const applications = useDistributorApplications()
  const updateStatus = useUpdateApplicationStatus()

  const tabs: { id: Tab; label: string; count: number | undefined }[] = [
    { id: 'messages', label: 'Contact messages', count: messages.data?.length },
    { id: 'applications', label: 'Distributor applications', count: applications.data?.length },
  ]

  return (
    <section aria-labelledby="admin-inbox-heading">
      <h2 id="admin-inbox-heading" className="text-heading">
        Inbox
      </h2>
      <p className="mt-2 text-[0.9375rem] text-ink-soft">
        Everything sent through the contact and distributor forms, newest first. Replies go out from your own mail.
      </p>

      <div role="tablist" aria-label="Inbox sections" className="mt-6 flex gap-1 border-b border-rule">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`inbox-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`inbox-panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={cn(
              '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-3 text-[0.9375rem] font-medium transition-colors',
              tab === item.id ? 'border-violet text-violet' : 'border-transparent text-ink-soft hover:text-ink',
            )}
          >
            {item.label}
            {item.count !== undefined && <span className="tabular text-sm text-ink-faint">{item.count}</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`inbox-panel-${tab}`} aria-labelledby={`inbox-tab-${tab}`} className="mt-6">
        {tab === 'messages' ? (
          <InboxList
            isLoading={messages.isLoading}
            error={messages.error}
            items={messages.data ?? []}
            emptyTitle="No messages yet"
            emptyDescription="Messages from the contact form land here."
            render={(message) => <MessageCard message={message} />}
          />
        ) : (
          <InboxList
            isLoading={applications.isLoading}
            error={applications.error}
            items={applications.data ?? []}
            emptyTitle="No applications yet"
            emptyDescription="Distributor applications land here for review."
            render={(application) => (
              <ApplicationCard
                application={application}
                onStatusChange={(status) => updateStatus.mutate({ id: application.id, status })}
              />
            )}
          />
        )}
      </div>
    </section>
  )
}

function InboxList<T extends { id: string }>({
  isLoading,
  error,
  items,
  emptyTitle,
  emptyDescription,
  render,
}: {
  isLoading: boolean
  error: Error | null
  items: T[]
  emptyTitle: string
  emptyDescription: string
  render: (item: T) => ReactNode
}) {
  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="border border-alert/30 bg-white px-4 py-3.5 text-sm text-alert">{error.message}</p>
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item.id} className="border border-rule bg-white p-5">
          {render(item)}
        </li>
      ))}
    </ul>
  )
}

function MessageCard({ message }: { message: ContactMessage }) {
  return (
    <article>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{message.name}</p>
            <Badge tone="violet">{message.topic}</Badge>
          </div>
          <a href={`mailto:${message.email}`} className="mt-0.5 block text-sm text-ink-soft underline decoration-rule-strong underline-offset-4 hover:text-violet">
            {message.email}
          </a>
        </div>
        <p className="text-sm text-ink-faint">{formatDateTime(message.submittedAt)}</p>
      </header>
      <p className="mt-4 text-[0.9375rem] leading-relaxed whitespace-pre-line">{message.message}</p>
    </article>
  )
}

function ApplicationCard({
  application,
  onStatusChange,
}: {
  application: DistributorApplication
  onStatusChange: (status: DistributorApplicationStatus) => void
}) {
  return (
    <article className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3">
          <p className="font-semibold">{application.fullName}</p>
          <p className="text-sm text-ink-faint">{formatDateTime(application.submittedAt)}</p>
        </header>
        <p className="mt-0.5 text-sm text-ink-soft">
          <a href={`mailto:${application.email}`} className="underline decoration-rule-strong underline-offset-4 hover:text-violet">
            {application.email}
          </a>
          <span className="text-ink-faint">, </span>
          {application.phone}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {application.address}, {application.city}, {application.province}
        </p>
        <dl className="mt-4 grid gap-3 text-[0.9375rem]">
          <div>
            <dt className="text-sm font-medium text-ink-faint">Selling experience</dt>
            <dd className="mt-0.5 leading-relaxed whitespace-pre-line">{application.sellingExperience}</dd>
          </div>
          {application.message && (
            <div>
              <dt className="text-sm font-medium text-ink-faint">Message</dt>
              <dd className="mt-0.5 leading-relaxed whitespace-pre-line">{application.message}</dd>
            </div>
          )}
        </dl>
      </div>
      <StatusSelect
        value={application.status}
        labels={applicationStatusLabels}
        label={`Status of ${application.fullName}'s application`}
        onChange={onStatusChange}
        className="lg:justify-self-end"
      />
    </article>
  )
}
