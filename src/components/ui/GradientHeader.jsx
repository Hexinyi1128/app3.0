export default function GradientHeader({ children, className = '', decorative = true }) {
  return (
    <header className={`relative overflow-hidden bg-mist-head rounded-b-sheet ${className}`}>
      {decorative && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="glass absolute -right-12 -top-14 h-44 w-44 rounded-full" />
          <div className="glass absolute right-10 top-24 h-10 w-28 rounded-full" />
          <div className="glass absolute -left-14 bottom-2 h-28 w-28 rounded-full" />
          <div className="glass absolute left-24 -top-8 h-14 w-14 rounded-full" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </header>
  )
}
