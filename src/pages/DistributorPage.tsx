import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, ButtonLink, Field, Select, TextArea, TextInput } from '@/components/ui'
import { distributorSchema, type DistributorValues } from '@/lib/validation/schemas'
import { submitDistributorApplication } from '@/features/distributor/distributor.api'
import { useAuth } from '@/features/auth/useAuth'
import { toast } from '@/stores/toast.store'

const terms = [
  { heading: 'Starting order', detail: '₱1,500 at wholesale — roughly six maintenance sets or a mixed box of soaps and toners.' },
  { heading: 'Your margin', detail: 'Wholesale sits about thirty percent under retail. You set your own selling price above the floor.' },
  { heading: 'Reseller ID', detail: 'Issued within a week of approval. Customers can verify it with us, which is what separates you from the fakes.' },
  { heading: 'What we ask', detail: 'Never sell below the floor, never repackage, and report counterfeits you come across. That is the whole contract.' },
]

export default function DistributorPage() {
  const { user, profile } = useAuth()
  const [reference, setReference] = useState<string | null>(null)

  const form = useForm<DistributorValues>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      fullName: profile?.fullName ?? '',
      email: user?.email ?? '',
      phone: profile?.phone ?? '',
      sellingExperience: 'none',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await submitDistributorApplication(values, user?.id ?? null)
      setReference(result.reference)
    } catch (error) {
      toast.error('Application not sent', error instanceof Error ? error.message : 'Try again in a moment.')
    }
  })

  return (
    <>
      <PageMeta
        title="Become a seller"
        description="Apply to sell Dr. Alvin at wholesale. Starting order ₱1,500, a verifiable reseller ID, and honest margins."
      />

      <header className="shell pt-12 lg:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-title">Become an authorised seller</h1>
          <p className="prose-reading mt-5 text-[1.125rem]">
            More than three thousand people sell Dr. Alvin from their homes, stalls and online
            shops. Most started with one box and a handful of neighbours. The terms are simple and
            they are all written here.
          </p>
        </div>
      </header>

      <div className="shell mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <dl className="grid gap-px self-start border-t border-ink">
          {terms.map((term) => (
            <div key={term.heading} className="border-b border-rule py-5">
              <dt className="text-[1.0625rem] font-semibold tracking-tight">{term.heading}</dt>
              <dd className="mt-1.5 font-serif text-[1rem] leading-relaxed text-ink-soft">{term.detail}</dd>
            </div>
          ))}
        </dl>

        {reference ? (
          <div className="self-start border border-verified/30 bg-verified-wash px-8 py-10">
            <h2 className="text-heading text-verified">Application received</h2>
            <p className="prose-reading mt-3">
              Your reference is <span className="tabular font-sans font-semibold text-ink">{reference}</span>.
              Someone from the reseller team will call the number you gave within three working days
              to confirm details and walk you through the first order.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/shop" variant="ink">
                Browse the range meanwhile
              </ButtonLink>
              <ButtonLink to="/regimen" variant="outline">
                Learn the regimen
              </ButtonLink>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 self-start border border-rule bg-white p-6 sm:p-8">
            <h2 className="text-heading">Apply</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={form.formState.errors.fullName?.message}>
                {(props) => <TextInput {...props} autoComplete="name" {...form.register('fullName')} />}
              </Field>
              <Field label="Mobile number" required error={form.formState.errors.phone?.message}>
                {(props) => <TextInput {...props} type="tel" autoComplete="tel" placeholder="0917 123 4567" {...form.register('phone')} />}
              </Field>
            </div>

            <Field label="Email" required error={form.formState.errors.email?.message}>
              {(props) => <TextInput {...props} type="email" autoComplete="email" {...form.register('email')} />}
            </Field>

            <Field label="Complete address" required hint="Where stock will be delivered." error={form.formState.errors.address?.message}>
              {(props) => <TextInput {...props} autoComplete="street-address" {...form.register('address')} />}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="City or municipality" required error={form.formState.errors.city?.message}>
                {(props) => <TextInput {...props} autoComplete="address-level2" {...form.register('city')} />}
              </Field>
              <Field label="Province" required error={form.formState.errors.province?.message}>
                {(props) => <TextInput {...props} autoComplete="address-level1" {...form.register('province')} />}
              </Field>
            </div>

            <Field label="Have you sold skincare before?" required error={form.formState.errors.sellingExperience?.message}>
              {(props) => (
                <Select {...props} {...form.register('sellingExperience')}>
                  <option value="none">No, this would be my first time</option>
                  <option value="online">Yes, online (Facebook, Shopee, TikTok)</option>
                  <option value="physical-store">Yes, from a stall or shop</option>
                  <option value="both">Yes, both online and in person</option>
                </Select>
              )}
            </Field>

            <Field label="Anything else" error={form.formState.errors.message?.message}>
              {(props) => <TextArea {...props} rows={4} placeholder="Where you plan to sell, how many customers you already have, questions about the terms." {...form.register('message')} />}
            </Field>

            <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="justify-self-start">
              {form.formState.isSubmitting ? 'Sending application' : 'Send application'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
