import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'slate',
}: {
  children: ReactNode
  tone?: 'slate' | 'green' | 'amber' | 'rose' | 'indigo'
}) {
  const toneClass =
    tone === 'green'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'amber'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : tone === 'rose'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : tone === 'indigo'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-slate-50 text-slate-700 border-slate-200'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClass,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
