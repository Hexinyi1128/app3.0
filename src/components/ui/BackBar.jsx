import { ArrowLeft } from './Icons.jsx'

export default function BackBar({ title, onBack, right }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-card active:scale-95"
        aria-label="返回"
      >
        <ArrowLeft />
      </button>
      {title && <span className="text-[13px] font-semibold text-ink">{title}</span>}
      <div className="flex h-9 min-w-9 items-center justify-end">{right}</div>
    </div>
  )
}
