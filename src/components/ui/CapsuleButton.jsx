import { ArrowRight } from './Icons.jsx'

const variants = {
  dark: { box: 'bg-ink text-white shadow-float', arrow: 'bg-white text-ink' },
  deep: { box: 'bg-deep text-white shadow-[0_10px_24px_rgba(85,128,176,0.26)]', arrow: 'bg-white text-deep' },
  light: { box: 'bg-white text-ink shadow-card', arrow: 'bg-ink text-white' },
  outline: { box: 'border border-line bg-white text-ink', arrow: 'bg-ink text-white' },
  mist: { box: 'bg-mist text-ink', arrow: 'bg-ink text-white' },
}

export default function CapsuleButton({
  children,
  onClick,
  variant = 'dark',
  fullWidth = true,
  disabled = false,
  showArrow = true,
  compact = false,
  className = '',
  type = 'button',
}) {
  const style = variants[variant] || variants.dark

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${
        compact ? 'h-9 pl-3.5 pr-1 text-[11px]' : 'h-[54px] pl-6 pr-2 text-[15px]'
      } ${style.box} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className="truncate">{children}</span>
      {showArrow && (
        <span className={`grid shrink-0 place-items-center rounded-full ${style.arrow} ${compact ? 'h-7 w-7' : 'h-10 w-10'}`}>
          <ArrowRight className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        </span>
      )}
    </button>
  )
}
