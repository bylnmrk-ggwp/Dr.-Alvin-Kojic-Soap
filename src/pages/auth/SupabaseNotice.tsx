import { cn } from '@/lib/utils'

/** Shown wherever a feature needs a Supabase project that has not been connected yet. */
export function SupabaseNotice({ className }: { className?: string }) {
  return (
    <div className={cn('border border-marigold/40 bg-marigold-wash px-4 py-3.5 text-sm leading-relaxed text-ink', className)}>
      <p className="font-medium">Accounts need a Supabase project.</p>
      <p className="mt-1 text-ink-soft">
        Add <code className="rounded-[2px] bg-white px-1 py-0.5 text-[0.8125rem]">VITE_SUPABASE_URL</code> and{' '}
        <code className="rounded-[2px] bg-white px-1 py-0.5 text-[0.8125rem]">VITE_SUPABASE_ANON_KEY</code> to{' '}
        <code className="rounded-[2px] bg-white px-1 py-0.5 text-[0.8125rem]">.env.local</code>, run the migration in{' '}
        <code className="rounded-[2px] bg-white px-1 py-0.5 text-[0.8125rem]">supabase/migrations</code>, and restart the dev server.
        Browsing and checkout work without it.
      </p>
    </div>
  )
}
