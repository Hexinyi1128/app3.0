const tones = {
  default: 'bg-mistlight text-deep',
  mist: 'bg-mist/70 text-deep',
  dark: 'bg-ink text-white',
  green: 'bg-okay/25 text-[#4F7B45]',
  red: 'bg-off/20 text-[#B05D56]',
  outline: 'border border-line bg-white text-muted',
  glass: 'glass-strong text-deep',
}

export default function Pill({ children, tone = 'default', onClick, active = false, className = '' }) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium leading-none transition ${tones[tone] || tones.default} ${onClick ? 'active:scale-95' : ''} ${active ? 'ring-2 ring-deep/30' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
