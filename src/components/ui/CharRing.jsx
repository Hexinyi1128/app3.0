export default function CharRing({ glyph, size = 72, variant = 'light', className = '' }) {
  const light = variant === 'light'
  return (
    <div
      style={{ width: size, height: size }}
      className={`${className.includes('absolute') ? '' : 'relative'} grid shrink-0 place-items-center rounded-full border ${light ? 'border-primary/35 bg-white/60 text-deep' : 'border-white/70 bg-white/10 text-white'} ${className}`}
    >
      <span className="absolute inset-[5px] rounded-full border border-current opacity-25" />
      <span className="font-semibold leading-none tracking-[0.08em]" style={{ fontSize: Math.round(size * 0.38) }}>
        {glyph}
      </span>
    </div>
  )
}
