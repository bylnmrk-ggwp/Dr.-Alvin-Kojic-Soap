import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, Field, TextInput } from '@/components/ui'
import { signInSchema, type SignInValues } from '@/lib/validation/schemas'
import { useAuth } from '@/features/auth/useAuth'
import { toast } from '@/stores/toast.store'
import { SupabaseNotice } from './SupabaseNotice'

export default function LoginPage() {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'

  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema) })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn(values)
      toast.success('Signed in')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Could not sign in. Check your details and try again.',
      })
    }
  })

  return (
    <>
      <PageMeta title="Sign in" />
      <div className="shell flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          <h1 className="text-title">Sign in</h1>
          <p className="prose-reading mt-3 text-[1rem]">
            See past orders, reorder in one tap, and track your seller application.
          </p>

          {!isConfigured && <SupabaseNotice className="mt-8" />}

          <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
            <Field label="Email" required error={form.formState.errors.email?.message}>
              {(props) => <TextInput {...props} type="email" autoComplete="email" disabled={!isConfigured} {...form.register('email')} />}
            </Field>
            <Field label="Password" required error={form.formState.errors.password?.message}>
              {(props) => <TextInput {...props} type="password" autoComplete="current-password" disabled={!isConfigured} {...form.register('password')} />}
            </Field>

            {form.formState.errors.root && (
              <p role="alert" className="border border-alert/30 bg-alert/5 px-3.5 py-2.5 text-sm text-alert">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button type="submit" size="lg" disabled={!isConfigured || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing in' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            New here?{' '}
            <Link to="/register" className="font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
