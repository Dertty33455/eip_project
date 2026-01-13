import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const base =
  'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-50 disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
  ghost:
    'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-stone-50 active:bg-stone-100',
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
    />
  )
}
