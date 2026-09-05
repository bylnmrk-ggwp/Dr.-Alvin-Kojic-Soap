import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, Field, TextInput } from '@/components/ui'
import { signUpSchema, type SignUpValues } from '@/lib/validation/schemas'
import { useAuth } from '@/features/auth/useAuth'
import { toast } from '@/stores/toast.store'
import { SupabaseNotice } from './SupabaseNotice'

export default function RegisterPage() {
  const { signUp, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string | null>(null)

  const form = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { needsEmailConfirmation } = await signUp(values)
      if (needsEmailConfirmation) {
        setAwaitingConfirmation(values.email)
        return
      }
      toast.success('Account created')
      navigate('/account', { replace: true })
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Could not create the account. Try again.',
      })
    }
  })

  if (awaitingConfirmation) {
    return (
      <>
        <PageMeta title="Confirm your email" />
        <div className="shell flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md border border-verified/30 bg-verified-wash px-8 py-10">
            <h1 className="text-heading text-verified">Check your inbox</h1>
            <p className="prose-reading mt-3">
              We sent a confirmation link to <span className="font-sans font-medium text-ink">{awaitingConfirmation}</span>.
              Open it to finish creating your account, then sign in.
            </p>
            <Link to="/login" className="mt-6 inline-block text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
              Go to sign in
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageMeta title="Create an account" />
      <div className="shell flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          <h1 className="text-title">Create an account</h1>
          <p className="prose-reading mt-3 text-[1rem]">
            Faster checkout, order history, and one place to manage a seller application.
          </p>

          {!isConfigured && <SupabaseNotice className="mt-8" />}

          <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
            <Field label="Full name" required error={form.formState.errors.fullName?.message}>
              {(props) => <TextInput {...props} autoComplete="name" disabled={!isConfigured} {...form.register('fullName')} />}
            </Field>
            <Field label="Email" required error={form.formState.errors.email?.message}>
              {(props) => <TextInput {...props} type="email" autoComplete="email" disabled={!isConfigured} {...form.register('email')} />}
            </Field>
            <Field label="Mobile number" required hint="Used for delivery updates only." error={form.formState.errors.phone?.message}>
              {(props) => <TextInput {...props} type="tel" autoComplete="tel" placeholder="0917 123 4567" disabled={!isConfigured} {...form.register('phone')} />}
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Password" required hint="8+ characters with a number." error={form.formState.errors.password?.message}>
                {(props) => <TextInput {...props} type="password" autoComplete="new-password" disabled={!isConfigured} {...form.register('password')} />}
              </Field>
              <Field label="Confirm password" required error={form.formState.errors.confirmPassword?.message}>
                {(props) => <TextInput {...props} type="password" autoComplete="new-password" disabled={!isConfigured} {...form.register('confirmPassword')} />}
              </Field>
            </div>

            {form.formState.errors.root && (
              <p role="alert" className="border border-alert/30 bg-alert/5 px-3.5 py-2.5 text-sm text-alert">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button type="submit" size="lg" disabled={!isConfigured || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating account' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            Already have one?{' '}
            <Link to="/login" className="font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
