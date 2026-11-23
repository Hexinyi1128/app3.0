import { Check } from './Icons.jsx'

export default function Toast({ message }) {
  if (!message) return null

  return (
    <div
      role="status"
      className="toast-in pointer-events-none fixed left-1/2 top-4 z-50 flex w-[310px] -translate-x-1/2 items-center gap-3 rounded-2xl bg-ink/95 px-4 py-3 text-white shadow-float backdrop-blur sm:top-9"
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-okay text-ink">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-[12px] leading-snug">{message}</span>
    </div>
  )
}
