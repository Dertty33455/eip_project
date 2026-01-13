import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
  illustrationSrc,
  illustrationAlt,
}: {
  title: string
  description?: string
  action?: ReactNode
  illustrationSrc?: string
  illustrationAlt?: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      {illustrationSrc ? (
        <div className="mx-auto mb-4 max-w-[260px]">
          <img
            src={illustrationSrc}
            alt={illustrationAlt ?? ''}
            className="h-auto w-full"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="text-base font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-sm text-slate-600">{description}</div>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}
