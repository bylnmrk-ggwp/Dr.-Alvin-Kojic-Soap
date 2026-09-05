import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ink' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[background-color,color,border-color,transform] duration-150 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px'

const variants: Record<Variant, string> = {
  // Marigold is the one loud colour and it is spent only here.
  primary: 'bg-marigold text-white hover:bg-marigold-deep rounded-[3px]',
  ink: 'bg-ink text-paper hover:bg-violet rounded-[3px]',
  outline:
    'border border-rule-strong bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper rounded-[3px]',
  ghost: 'text-ink-soft hover:text-ink hover:bg-chalk rounded-[3px]',
  link: 'text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet px-0',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    />
  )
})

export type ButtonLinkProps = CommonProps & LinkProps

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    />
  )
}
