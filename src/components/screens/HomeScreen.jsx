import { useRef, useState } from 'react'
import data, { findIsland } from '../../data/index.js'
import Card from '../ui/Card.jsx'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import CharRing from '../ui/CharRing.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'
import SceneArt from '../ui/SceneArt.jsx'
import { ArrowRight, ChevronRight, Pin } from '../ui/Icons.jsx'

const CARD_STEP = 266

export default function HomeScreen({ profile, selectedIslandId, booking, onSelectIsland, onOpenDetail, onOpenMap, onEditLocation, onContinue }) {
  const [index, setIndex] = useState(Math.max(0, data.islands.findIndex((item) => item.id === selectedIslandId)))
  const trackRef = useRef(null)
  const lastIndex = useRef(index)

  const handleScroll = (event) => {
    const next = Math.min(data.islands.length - 1, Math.max(0, Math.round(event.currentTarget.scrollLeft / CARD_STEP)))
    if (next === lastIndex.current) return
    lastIndex.current = next
    setIndex(next)
    onSelectIsland(data.islands[next].id)
  }

  const goTo = (next) => {
    trackRef.current?.scrollTo({ left: next * CARD_STEP, behavior: 'smooth' })
    lastIndex.current = next
    setIndex(next)
    onSelectIsland(data.islands[next].id)
  }

  const activeIsland = findIsland(selectedIslandId) || data.islands[0]
  const nearby = data.islands.slice(2, 4)

  return (
    <div className="min-h-full bg-page">
      <GradientHeader className="px-6 pb-20 pt-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.26em] text-deep/70">ISLAND HOP / 跳岛</p>
            <p className="mt-4 text-[12px] text-deep/80">嗨，{profile.nickname} · 探索第 {profile.islandDays} 天</p>
          </div>
          <button type="button" onClick={onEditLocation} className="glass mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium text-deep" title="修改定位">
            <Pin className="h-3 w-3" /> {profile.location?.split(' · ').slice(0, 2).join(' · ')}
          </button>
        </div>
        <h1 className="mt-5 text-[30px] font-bold leading-tight tracking-tight text-ink">下一座岛，哪座？</h1>
        <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-deep/80">
          与其想几个月，不如先跳一座岛。
        </p>
        <CharRing glyph="岛" size={88} variant="light" className="absolute right-7 top-[92px] opacity-80" />
      </GradientHeader>

      <div className="overlap -mt-9 px-5 pb-16">
        <Card className="overflow-hidden p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-[0.18em] text-primary">FOR YOU</p>
              <h2 className="mt-1 text-[17px] font-semibold text-ink">为你推荐</h2>
            </div>
            <button type="button" onClick={onOpenMap} className="flex items-center gap-1 text-[11px] text-muted">
              看看附近 <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-2"
          >
            {data.islands.map((island) => (
              <button
                key={island.id}
                type="button"
                onClick={() => {
                  const next = data.islands.indexOf(island)
                  lastIndex.current = next
                  setIndex(next)
                  onSelectIsland(island.id)
                }}
                className="scene-card relative h-[282px] w-[252px] shrink-0 snap-start overflow-hidden rounded-[20px] p-5 text-left transition"
              >
                <SceneArt id={island.id} />
                {island.id === activeIsland.id && (
                  <span className="pointer-events-none absolute inset-0 z-20 rounded-[20px] ring-2 ring-inset ring-deep" />
                )}
                <div className="relative z-10 flex items-start justify-between">
                  <Pill tone="glass" className="text-deep">{island.hotTag}</Pill>
                  <span className="glass-strong grid h-8 w-8 place-items-center rounded-full text-deep">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                {island.id === 'coffee' ? (
                  <div className="h-4" />
                ) : (
                  <CharRing glyph={island.glyph} size={100} variant="light" className="relative z-10 mx-auto mt-4" />
                )}
                <div className="relative z-10 mt-4">
                  <p className="text-[9px] font-semibold tracking-[0.18em] text-deep/80">{island.en}</p>
                  <h3 className="mt-0.5 text-[21px] font-bold tracking-tight text-ink">{island.name}</h3>
                </div>
                <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/60 pt-3 text-[11px] text-deep">
                  <span>{island.duration} · {island.distance}</span>
                  <span className="font-semibold">¥{island.price} 起</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-1.5">
            {data.islands.map((island, dot) => (
              <button
                key={island.id}
                type="button"
                onClick={() => goTo(dot)}
                aria-label={`查看第 ${dot + 1} 座岛`}
                className={`h-1.5 rounded-full transition-all ${dot === index ? 'w-5 bg-deep' : 'w-1.5 bg-mist'}`}
              />
            ))}
          </div>

          <div className="mt-5">
            <CapsuleButton variant="deep" onClick={() => onOpenDetail(activeIsland.id)}>
              预约这次体验
            </CapsuleButton>
            <p className="mt-3 text-center text-[11px] leading-5 text-muted">
              {booking ? '有一次体验正在进行，随时可以继续。' : '先看看，再决定要不要留下。'}
            </p>
            {booking && (
              <button type="button" onClick={onContinue} className="mx-auto mt-2 block text-[11px] font-semibold text-primary">
                继续上次体验 →
              </button>
            )}
          </div>
        </Card>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">离你很近</h2>
            <button type="button" onClick={onOpenMap} className="text-[11px] text-muted">打开地图 →</button>
          </div>
          <div className="space-y-2.5">
            {nearby.map((island) => (
              <Card key={island.id} onClick={() => onOpenDetail(island.id)} className="flex items-center gap-3 p-3.5">
                <CharRing glyph={island.glyph} size={46} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{island.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{island.distance} · {island.duration} · 4.8 分</p>
                </div>
                <ChevronRight className="text-muted" />
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-6 p-5">
          <p className="text-[10px] font-medium tracking-[0.18em] text-primary">HOW IT WORKS</p>
          <h2 className="mt-1 text-[16px] font-semibold text-ink">跳岛，不用一次想清楚</h2>
          <div className="mt-4 flex items-center justify-between gap-2">
            {[
              ['登岛', '用半天试试看'],
              ['离岛 / 再登岛', '都算有收获'],
              ['跳岛日志', '只记观察，不定论'],
            ].map(([title, desc], i) => (
              <div key={title} className="flex flex-1 items-center gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-deep">{title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-muted">{desc}</p>
                </div>
                {i < 2 && <span className="h-px w-3 shrink-0 bg-line" />}
              </div>
            ))}
          </div>
        </Card>

        <p className="pb-4 pt-6 text-center text-[10px] tracking-wide text-muted">
          下一座岛，随时可以跳 · 不着急给人生下结论
        </p>
      </div>
    </div>
  )
}
