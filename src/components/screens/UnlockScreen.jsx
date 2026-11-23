import data from '../../data/index.js'
import Card from '../ui/Card.jsx'
import CharRing from '../ui/CharRing.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'

const POS = [[18, 24], [48, 16], [78, 28], [26, 50], [56, 46], [84, 60], [16, 76], [50, 78]]

export default function UnlockScreen({ records, onOpenIsland, onLocked }) {
  const visited = [...new Set(records.map((record) => record.islandId))]
  const points = POS.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <div className="min-h-full bg-page">
      <GradientHeader className="px-5 pb-14 pt-10">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-deep/70">ISLAND MAP</p>
        <h1 className="mt-3 text-[27px] font-bold tracking-tight text-ink">跳岛地图</h1>
        <p className="mt-1.5 text-[12px] text-deep/80">你登过的每一座岛，都会亮起来。</p>
        <Pill tone="glass" className="mt-5">已解锁 {visited.length} / {data.islands.length} 座岛</Pill>
      </GradientHeader>

      <div className="overlap -mt-7 px-5">
        <Card className="overflow-hidden">
          <div className="map-grid relative h-[296px] overflow-hidden">
            <div className="pointer-events-none absolute -left-[10%] top-[34%] h-3 w-[130%] -rotate-12 rounded-full bg-white/70" />
            <div className="pointer-events-none absolute left-[20%] -top-[10%] h-[130%] w-2 rotate-12 rounded-full bg-white/70" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <polyline points={points} fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 2" />
            </svg>
            {data.islands.map((island, index) => {
              const on = visited.includes(island.id)
              return (
                <button
                  key={island.id}
                  type="button"
                  onClick={() => (on ? onOpenIsland(island.id) : onLocked())}
                  style={{ left: `${POS[index][0]}%`, top: `${POS[index][1]}%` }}
                  className={`unlock-node ${on ? '' : 'locked'}`}
                >
                  <span className="orb">{on ? island.glyph : '?'}</span>
                  <small>{on ? island.name : '未解锁'}</small>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="mt-6 flex items-baseline justify-between">
          <h2 className="text-[16px] font-semibold text-ink">我的岛屿</h2>
          <span className="text-[10px] text-muted">点亮过的方向</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {data.islands.map((island) => {
            const on = visited.includes(island.id)
            const record = records.find((item) => item.islandId === island.id)
            return (
              <button
                key={island.id}
                type="button"
                onClick={() => (on ? onOpenIsland(island.id) : onLocked())}
                className={`rounded-card bg-white p-3 text-left shadow-card transition active:scale-[0.99] ${on ? '' : 'opacity-60'}`}
              >
                <div className="flex items-center gap-2">
                  <CharRing glyph={island.glyph} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-ink">{island.name}</p>
                    <p className="mt-0.5 text-[9px] text-muted">{on ? '已登岛' : '未解锁'}</p>
                  </div>
                </div>
                {on && record && (
                  <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-deep">“{record.memo}”</p>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-center text-[10px] leading-5 text-muted">离岛也是一种解锁：排除掉的方向，同样是你走过的岛。</p>
        <p className="pb-2 pt-8 text-center text-[10px] text-muted">下一座岛，随时可以跳 · 不着急给人生下结论</p>
      </div>
    </div>
  )
}
