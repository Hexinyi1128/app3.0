import { useEffect, useRef, useState } from 'react'
import data, { findIsland, findStore } from '../../data/index.js'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import CharRing from '../ui/CharRing.jsx'
import Pill from '../ui/Pill.jsx'
import SceneArt from '../ui/SceneArt.jsx'
import { Pin, Search } from '../ui/Icons.jsx'

export default function MapScreen({ location, selectedIslandId, selectedStoreId, onOpenDetail, onEditLocation }) {
  const [query, setQuery] = useState('')
  const [activeStoreId, setActiveStoreId] = useState(selectedStoreId || data.stores[0].id)
  const trackRef = useRef(null)
  const cardRefs = useRef({})

  const stores = data.stores.filter((store) => {
    const island = findIsland(store.islandId)
    const text = `${store.name}${island.name}${island.category}${store.mentor.name}`
    return !query.trim() || text.includes(query.trim())
  })

  useEffect(() => {
    if (selectedStoreId) setActiveStoreId(selectedStoreId)
  }, [selectedStoreId])

  const activeStore = findStore(activeStoreId) || stores[0] || data.stores[0]
  const activeIsland = findIsland(activeStore.islandId)

  const selectStore = (id, shouldScroll = true) => {
    setActiveStoreId(id)
    if (!shouldScroll || !trackRef.current || !cardRefs.current[id]) return
    const card = cardRefs.current[id]
    trackRef.current.scrollTo({
      left: card.offsetLeft - trackRef.current.offsetLeft - 24,
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-full bg-page">
      <div className="bg-white px-5 pb-5 pt-10">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-primary">NEARBY ISLANDS</p>
        <h1 className="mt-2 text-[25px] font-bold tracking-tight text-ink">附近的岛</h1>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-page px-4 py-3">
          <Search className="shrink-0 text-primary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={location}
            className="w-full bg-transparent text-[12px] text-ink outline-none placeholder:text-muted"
          />
          <button type="button" onClick={onEditLocation} className="shrink-0 text-primary" title="修改定位" aria-label="修改定位">
            <Pin className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="map-grid relative h-[360px] overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[10%] top-[34%] h-3 w-[130%] -rotate-12 rounded-full bg-white/70" />
          <div className="absolute left-[18%] -top-[10%] h-[130%] w-2 rotate-12 rounded-full bg-white/70" />
          <div className="absolute -left-[20%] top-[72%] h-2 w-[140%] rotate-[8deg] rounded-full bg-white/50" />
          <div className="absolute left-[56%] -top-[10%] h-[130%] w-1.5 -rotate-6 rounded-full bg-white/60" />
          <div className="absolute left-[6%] top-[52%] h-1.5 w-[45%] rotate-[28deg] rounded-full bg-white/50" />
        </div>

        <div className="absolute left-[45%] top-[47%] -translate-x-1/2 -translate-y-1/2">
          <span className="ping-soft absolute -inset-3 rounded-full bg-primary/40" />
          <span className="relative block h-3.5 w-3.5 rounded-full border-[3px] border-white bg-deep shadow" />
        </div>

        {stores.map((store) => {
          const active = store.id === activeStore.id
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => selectStore(store.id, true)}
              style={{ left: `${store.x}%`, top: `${store.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition ${active ? 'z-10 scale-110' : 'z-0'}`}
            >
              <span
                title={store.name}
                className={`grid h-10 w-10 place-items-center rounded-full border border-white/90 text-[15px] font-bold shadow-card ${
                  active ? 'bg-deep text-white' : 'bg-white text-deep'
                }`}
              >
                {findIsland(store.islandId).glyph}
              </span>
              {active && <span className="mx-auto -mt-1 block h-2 w-2 rotate-45 bg-deep" />}
            </button>
          )
        })}

        <div className="absolute bottom-3 left-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] text-deep shadow-card backdrop-blur">
          已定位 · 静安寺周边
        </div>
      </div>

      <div className="px-5 pb-6 pt-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[16px] font-semibold text-ink">附近 {stores.length} 座岛</h2>
          <span className="text-[11px] text-muted">按距离排序</span>
        </div>

        <div ref={trackRef} className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {stores.map((store) => {
            const island = findIsland(store.islandId)
            const active = store.id === activeStore.id
            return (
              <div
                key={store.id}
                ref={(node) => { cardRefs.current[store.id] = node }}
                onClick={() => selectStore(store.id, false)}
                className={`w-[278px] shrink-0 rounded-card bg-white p-3.5 shadow-card transition ${active ? 'ring-2 ring-inset ring-deep' : ''}`}
              >
                <div className="scene-card relative flex h-[92px] items-center justify-between overflow-hidden rounded-2xl px-4">
                  <SceneArt id={island.id} />
                  <div className="relative z-10">
                    <p className="text-[9px] font-semibold tracking-[0.16em] text-deep">{island.en}</p>
                    <p className="mt-2 text-[10px] text-deep">门店实景 · 已认证导师</p>
                  </div>
                  <CharRing glyph={island.glyph} size={56} variant="light" className="relative z-10" />
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">{store.name}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {store.distance} · {store.duration} · 余{store.spots}位 · {store.rating}分
                    </p>
                  </div>
                  <Pill tone="green">{store.mentor.certified ? '认证' : '新导师'}</Pill>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[15px] font-bold text-ink">¥{store.price}<span className="text-[10px] font-normal text-muted"> 起</span></span>
                  <CapsuleButton variant="deep" fullWidth={false} compact onClick={() => onOpenDetail(island.id, store.id)}>
                    预约体验
                  </CapsuleButton>
                </div>
              </div>
            )
          })}
        </div>
        {stores.length === 0 && (
          <p className="rounded-card bg-white p-6 text-center text-[12px] text-muted">没有找到这座岛，换个关键词试试。</p>
        )}

        <p className="mt-5 text-center text-[10px] leading-5 text-muted">
          距离和余位是模拟数据 · 下一座岛，随时可以跳
        </p>
      </div>
    </div>
  )
}
