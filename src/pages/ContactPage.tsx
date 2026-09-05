import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, Field, Select, TextArea, TextInput } from '@/components/ui'
import { contactSchema, type ContactValues } from '@/lib/validation/schemas'
import { submitContactMessage } from '@/features/support/contact.api'
import { site } from '@/config/site'
import { toast } from '@/stores/toast.store'

const topics: { value: ContactValues['topic']; label: string }[] = [
  { value: 'order', label: 'An order I placed' },
  { value: 'product-advice', label: 'Which product to use' },
  { value: 'authenticity', label: 'Checking a seller or product is genuine' },
  { value: 'reselling', label: 'Becoming a seller' },
  { value: 'other', label: 'Something else' },
]

export default function ContactPage() {
  const [params] = useSearchParams()
  const [isSent, setIsSent] = useState(false)
  const requestedTopic = params.get('topic') as ContactValues['topic'] | null

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: topics.some((topic) => topic.value === requestedTopic) ? requestedTopic! : 'product-advice',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await submitContactMessage(values)
      setIsSent(true)
    } catch (error) {
      toast.error('Message not sent', error instanceof Error ? error.message : 'Try again in a moment.')
    }
  })

  return (
    <>
      <PageMeta title="Contact us" description="Ask about an order, a product, or whether a seller is authorised." />

      <div className="shell grid gap-12 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:pt-16">
        <div>
          <h1 className="text-title">Contact us</h1>
          <p className="prose-reading mt-5">
            Product questions are answered by people who use the range themselves. Authenticity
            checks are usually confirmed the same working day.
          </p>

          <dl className="mt-10 grid gap-6 border-t border-rule pt-8 text-[0.9375rem]">
            <div>
              <dt className="font-medium">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Phone and Viber</dt>
              <dd className="mt-1 text-ink-soft">{site.phone}</dd>
              <dd className="text-[0.8125rem] text-ink-faint">Monday to Saturday, 9am to 6pm</dd>
            </div>
            <div>
              <dt className="font-medium">Office</dt>
              <dd className="mt-1 text-ink-soft">
                {site.address.line1}
                <br />
                {site.address.line2}
              </dd>
            </div>
          </dl>
        </div>

        {isSent ? (
          <div className="self-start border border-verified/30 bg-verified-wash px-8 py-10">
            <h2 className="text-heading text-verified">Message sent</h2>
            <p className="prose-reading mt-3">
              Thanks — we reply to everything within one working day, faster for authenticity checks.
              A copy has gone to the address you gave.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => { setIsSent(false); form.reset() }}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 self-start border border-rule bg-white p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" required error={form.formState.errors.name?.message}>
                {(props) => <TextInput {...props} autoComplete="name" {...form.register('name')} />}
              </Field>
              <Field label="Email" required error={form.formState.errors.email?.message}>
                {(props) => <TextInput {...props} type="email" autoComplete="email" {...form.register('email')} />}
              </Field>
            </div>

            <Field label="What is this about?" required error={form.formState.errors.topic?.message}>
              {(props) => (
                <Select {...props} {...form.register('topic')}>
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              label="Message"
              required
              hint="For seller checks, include the seller name and their reseller ID if they gave you one."
              error={form.formState.errors.message?.message}
            >
              {(props) => <TextArea {...props} rows={6} {...form.register('message')} />}
            </Field>

            <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="justify-self-start">
              {form.formState.isSubmitting ? 'Sending' : 'Send message'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
