export default function Toggle({ checked, onChange, label, tone = 'positive' }) {
  const onColor = tone === 'negative' ? 'bg-off' : 'bg-okay'
  const dotColor = tone === 'negative' ? 'bg-white' : 'bg-white'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3.5 text-left transition active:scale-[0.99]"
    >
      <span className="text-[13px] leading-snug text-ink">{label}</span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? onColor : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-all ${dotColor} ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  )
}
