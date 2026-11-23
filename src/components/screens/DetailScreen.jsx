import { useRef, useState } from 'react'
import data, { findLevel, findStore } from '../../data/index.js'
import Card from '../ui/Card.jsx'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import CharRing from '../ui/CharRing.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'
import BackBar from '../ui/BackBar.jsx'
import SceneArt from '../ui/SceneArt.jsx'
import { Check, ChevronRight, Clock, Pin, Spark } from '../ui/Icons.jsx'

const filters = [
  { id: 'recommend', label: '为你推荐' },
  { id: 'near', label: '附近优先' },
  { id: 'quick', label: '30分钟速试' },
  { id: 'custom', label: '＋自定义' },
]

const customTags = ['后期修图', '拍摄过程', '动手创造', '与人交流']

export default function DetailScreen({ island, levelId, filter, onFilterChange, onSelectLevel, onBook, onBack, onOpenIsland, storeId }) {
  const [custom, setCustom] = useState(['后期修图'])
  const levelsRef = useRef(null)

  const store = findStore(storeId) || data.stores.find((item) => item.islandId === island.id) || data.stores[0]
  const level = findLevel(levelId)

  let feed = data.islands.filter((item) => item.id !== island.id)
  if (filter === 'near') feed = [...feed].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
  if (filter === 'quick') feed = feed.filter((item) => item.price <= 139)
  if (filter === 'custom' && custom.length) {
    feed = feed.filter((item) => item.tags.some((tag) => custom.includes(tag)))
  }

  const scrollToLevels = () => levelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div className="min-h-full bg-page pb-32">
      <GradientHeader className="px-5 pb-8 pt-5" decorative>
        <BackBar
          onBack={onBack}
          right={<Pill tone="glass">第 {data.user.islandDays} 天</Pill>}
        />
        <p className="mt-4 text-[10px] font-semibold tracking-[0.22em] text-deep/70">ISLAND DETAIL</p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-ink">嗨，先看看这座岛</h1>
        <p className="mt-2 text-[12px] text-deep/80">看过了再决定，不必现在就有答案。</p>
      </GradientHeader>

      <div className="px-5 pt-5">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map((item) => (
            <Pill
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              tone={filter === item.id ? 'dark' : 'default'}
            >
              {item.label}
            </Pill>
          ))}
        </div>

        {filter === 'custom' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {customTags.map((tag) => (
              <Pill
                key={tag}
                tone={custom.includes(tag) ? 'mist' : 'outline'}
                onClick={() => setCustom((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
              >
                {tag}
              </Pill>
            ))}
          </div>
        )}

        <Card className="mt-4 overflow-hidden">
          <div className="scene-card relative h-[172px] overflow-hidden p-5">
            <SceneArt id={island.id} />
            <div className="glass-strong absolute -right-10 -top-12 h-40 w-40 rounded-full" />
            <div className="glass absolute right-16 top-20 h-10 w-24 rounded-full" />
            <div className="relative z-10"><Pill tone="glass" className="text-deep">{island.hotTag}</Pill></div>
            <CharRing glyph={island.glyph} size={88} variant="light" className="absolute right-6 top-10 z-10" />
            <p className="absolute bottom-5 left-5 z-10 text-[10px] font-semibold tracking-[0.18em] text-deep">{island.en}</p>
          </div>

          <div className="p-5">
            <h2 className="text-[23px] font-bold tracking-tight text-ink">{island.name}</h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">{island.summary}</p>

            <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl bg-page py-3.5">
              <div className="px-2 text-center">
                <Pin className="mx-auto text-primary" />
                <p className="mt-1.5 text-[11px] font-semibold text-ink">{island.distance}</p>
                <p className="mt-0.5 text-[9px] text-muted">距离</p>
              </div>
              <div className="px-2 text-center">
                <Clock className="mx-auto text-primary" />
                <p className="mt-1.5 text-[11px] font-semibold text-ink">{island.duration}</p>
                <p className="mt-0.5 text-[9px] text-muted">时长</p>
              </div>
              <div className="px-2 text-center">
                <Spark className="mx-auto text-primary" />
                <p className="mt-1.5 text-[11px] font-semibold text-ink">导师带练</p>
                <p className="mt-0.5 text-[9px] text-muted">真实任务</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted">{island.explorers} 人已登岛 · 余 {island.spots} 位</p>
                <p className="mt-0.5 text-[19px] font-bold text-ink">¥{island.price}<span className="text-[11px] font-normal text-muted"> 起</span></p>
              </div>
              <CapsuleButton variant="deep" fullWidth={false} onClick={scrollToLevels} compact>
                选登岛方式
              </CapsuleButton>
            </div>
          </div>
        </Card>

        <div ref={levelsRef} className="mt-7">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold text-ink">选择登岛方式</h2>
            <span className="text-[11px] text-muted">随时可以换一档</span>
          </div>
          <div className="space-y-2.5">
            {data.levels.map((item) => {
              const active = item.id === levelId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectLevel(item.id)}
                  className={`w-full rounded-card border p-4 text-left transition active:scale-[0.99] ${
                    active ? 'border-deep bg-mistlight/70 shadow-card' : 'border-line bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-ink">
                        {item.name}
                        <span className="ml-2 text-[11px] font-normal text-muted">{item.duration}</span>
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted">{item.desc}</p>
                    </div>
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? 'border-deep bg-deep text-white' : 'border-line text-transparent'}`}>
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[15px] font-bold text-ink">¥{item.price}</span>
                    {item.badge && <Pill tone="green">{item.badge}</Pill>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Card className="mt-6 p-4">
          <div className="flex items-center gap-3">
            <CharRing glyph={store.mentor.name.slice(0, 1)} size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">{store.mentor.name} · 带你登岛</p>
              <p className="mt-1 truncate text-[10px] text-muted">{store.mentor.credential}</p>
            </div>
            <Pill tone="green">已认证</Pill>
          </div>
          <p className="mt-3 border-t border-line pt-3 text-[10px] leading-5 text-muted">
            {store.name} · {store.distance} · 导师会带你做真实任务，做不出来也没关系。
          </p>
        </Card>

        <div className="mt-7">
          <h2 className="mb-3 text-[17px] font-semibold text-ink">推荐下一座岛</h2>
          <div className="space-y-2.5">
            {feed.slice(0, 3).map((item) => (
              <Card key={item.id} onClick={() => onOpenIsland(item.id)} className="flex items-center gap-3 p-3">
                <CharRing glyph={item.glyph} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted">{item.distance} · {item.duration} · ¥{item.price} 起</p>
                </div>
                <ChevronRight className="text-muted" />
              </Card>
            ))}
            {feed.length === 0 && (
              <p className="rounded-card bg-white p-5 text-center text-[11px] text-muted">这个筛选下暂时没有别的岛。</p>
            )}
          </div>
        </div>

        <p className="pb-4 pt-6 text-center text-[10px] text-muted">登岛不是承诺，只是一段真实的时间。</p>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[375px] -translate-x-1/2 items-center gap-3 border-t border-line bg-white/95 px-5 py-3 backdrop-blur sm:bottom-5 sm:rounded-b-sheet">
        <div className="shrink-0">
          <p className="text-[10px] text-muted">{level.duration} · {level.name}</p>
          <p className="text-[19px] font-bold leading-tight text-ink">¥{level.price}</p>
        </div>
        <CapsuleButton variant="dark" onClick={onBook}>确认预约 · 登岛</CapsuleButton>
      </div>
    </div>
  )
}
