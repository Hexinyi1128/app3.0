import { Plus, HomeIcon, MapIcon, UnlockIcon, JournalIcon } from './Icons.jsx'

const tabs = [
  { id: 'home', label: '首页', icon: HomeIcon },
  { id: 'map', label: '地图', icon: MapIcon },
  { id: 'unlock', label: '跳岛地图', icon: UnlockIcon },
  { id: 'journal', label: '档案', icon: JournalIcon },
]

export default function BottomNav({ active, onNavigate, onPlus }) {
  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-[375px] -translate-x-1/2 px-4 sm:bottom-5"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      aria-label="主导航"
    >
      <div className="pointer-events-auto flex items-center justify-between gap-0.5 rounded-full border border-white/70 bg-white/85 p-1.5 px-2 shadow-nav backdrop-blur-xl">
        {tabs.slice(0, 2).map((tab) => (
          <TabButton key={tab.id} tab={tab} active={active === tab.id} onClick={() => onNavigate(tab.id)} />
        ))}

        <button
          type="button"
          onClick={onPlus}
          className="-mt-3 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-white shadow-[0_8px_18px_rgba(85,128,176,0.4)] transition active:scale-95"
          aria-label="快速开始"
          title="快速开始"
        >
          <Plus />
        </button>

        {tabs.slice(2).map((tab) => (
          <TabButton key={tab.id} tab={tab} active={active === tab.id} onClick={() => onNavigate(tab.id)} />
        ))}
      </div>
    </nav>
  )
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={tab.label}
      title={tab.label}
      className={`grid h-11 w-12 shrink-0 place-items-center rounded-full transition active:scale-95 ${
        active ? 'bg-ink text-white shadow-float' : 'bg-white text-muted'
      }`}
    >
      <Icon />
    </button>
  )
}
