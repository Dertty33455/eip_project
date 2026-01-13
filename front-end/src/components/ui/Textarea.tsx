import type { TextareaHTMLAttributes } from 'react'

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/25',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
