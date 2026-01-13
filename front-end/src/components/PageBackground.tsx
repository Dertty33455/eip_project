export function PageBackground({ variant = 'app' }: { variant?: 'app' | 'admin' }) {
  const grainUrl = new URL('../assets/backgrounds/paper-grain.svg', import.meta.url).toString()
  const dotsUrl = new URL('../assets/backgrounds/dots.svg', import.meta.url).toString()
  const linesUrl = new URL('../assets/backgrounds/soft-lines.svg', import.meta.url).toString()

  const textureUrl = variant === 'admin' ? dotsUrl : linesUrl

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${textureUrl})`, opacity: variant === 'admin' ? 0.28 : 0.22 }}
      />

      <div
        className="absolute inset-0 bg-repeat"
        style={{ backgroundImage: `url(${grainUrl})`, opacity: variant === 'admin' ? 0.22 : 0.18 }}
      />

      <div className={variant === 'admin' ? 'absolute inset-0 bg-white/70' : 'absolute inset-0 bg-white/60'} />

      <div
        className={[
          'absolute inset-0',
          variant === 'admin'
            ? 'bg-[radial-gradient(1200px_600px_at_20%_0%,theme(colors.amber.100)_0%,transparent_55%),radial-gradient(1000px_520px_at_90%_10%,theme(colors.stone.100)_0%,transparent_60%)]'
            : 'bg-[radial-gradient(1200px_600px_at_10%_0%,theme(colors.amber.100)_0%,transparent_55%),radial-gradient(900px_520px_at_95%_15%,theme(colors.stone.100)_0%,transparent_60%)]',
        ].join(' ')}
        style={{ opacity: variant === 'admin' ? 0.35 : 0.45 }}
      />

      <div className="absolute -right-24 top-10 hidden w-[520px] opacity-[0.10] md:block">
        <img
          src={
            variant === 'admin'
              ? new URL('../assets/illustrations/admin.svg', import.meta.url).toString()
              : new URL('../assets/illustrations/reading.svg', import.meta.url).toString()
          }
          alt=""
          className="h-auto w-full"
          loading="lazy"
        />
      </div>

      <div className="absolute -left-28 bottom-8 hidden w-[420px] opacity-[0.08] md:block">
        <img
          src={
            variant === 'admin'
              ? new URL('../assets/illustrations/orders.svg', import.meta.url).toString()
              : new URL('../assets/illustrations/chat.svg', import.meta.url).toString()
          }
          alt=""
          className="h-auto w-full"
          loading="lazy"
        />
      </div>
    </div>
  )
}
