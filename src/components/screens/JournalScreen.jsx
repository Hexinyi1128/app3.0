import Card from '../ui/Card.jsx'
import CharRing from '../ui/CharRing.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'
import { Spark } from '../ui/Icons.jsx'

const statusMeta = {
  revisit: { label: '想再登岛', tone: 'green' },
  excluded: { label: '已排除', tone: 'outline' },
  watching: { label: '待观察', tone: 'mist' },
}

export default function JournalScreen({ profile, records, preferences, insight, onOpenIsland, onHome }) {
  const stats = [
    { value: records.length, label: '已登岛 · 座' },
    { value: records.filter((item) => item.status === 'excluded').length, label: '离岛排除 · 座' },
    { value: records.filter((item) => item.status === 'revisit').length, label: '想再登岛 · 座' },
  ]

  return (
    <div className="min-h-full bg-page pb-10">
      <GradientHeader className="px-5 pb-16 pt-10">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-deep/70">ISLAND JOURNAL</p>
        <h1 className="mt-3 text-[27px] font-bold tracking-tight text-ink">跳岛日志</h1>
        <p className="mt-1.5 text-[12px] text-deep/80">跳岛的第 {profile.islandDays} 天 · {profile.nickname}</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {stats.map((item) => (
            <div key={item.label} className="glass-strong rounded-2xl px-2 py-3 text-center">
              <p className="text-[21px] font-bold leading-none text-ink">{item.value}</p>
              <p className="mt-1.5 text-[9px] text-deep/80">{item.label}</p>
            </div>
          ))}
        </div>
      </GradientHeader>

      <div className="overlap -mt-7 px-5">
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[16px] font-semibold text-ink">工作偏好画像</h2>
            <span className="text-[10px] text-muted">来自每次登岛后的记录</span>
          </div>
          <div className="mt-5 space-y-4">
            {preferences.map((item) => (
              <div key={item.id}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-deep">{item.label}</span>
                  <span className="font-semibold text-ink">{item.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-mistlight">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-line pt-3 text-[10px] leading-5 text-muted">
            这是偏好的变化轨迹，不是能力评分。分数低只代表暂时不喜欢。
          </p>
        </Card>

        <div className="mt-7">
          <h2 className="mb-4 text-[16px] font-semibold text-ink">跳岛轨迹</h2>
          <div className="relative pl-6">
            <div className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
            {records.map((record) => {
              const meta = statusMeta[record.status] || statusMeta.watching
              return (
                <div key={record.id} className="relative pb-3.5">
                  <span className="absolute -left-[23px] top-6 h-3 w-3 rounded-full border-2 border-white bg-primary shadow" />
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <CharRing glyph={record.glyph} size={42} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-ink">{record.islandName}</p>
                          <Pill tone={meta.tone}>{meta.label}</Pill>
                        </div>
                        <p className="mt-1 text-[10px] text-muted">{record.date} · {record.level}</p>
                      </div>
                    </div>
                    <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-deep">“{record.memo}”</p>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        <Card className="mt-5 overflow-hidden">
          <div className="bg-gradient-to-br from-mistlight to-white p-5">
            <div className="flex items-center gap-2">
              <Spark className="text-primary" />
              <h2 className="text-[16px] font-semibold text-ink">跳岛洞察</h2>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-deep">{insight}</p>
            <p className="mt-4 text-[10px] text-muted">由历次体验日记生成 · 仅供参考</p>
          </div>
        </Card>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={() => onOpenIsland(records[0]?.islandId || 'photo')}
            className="w-full rounded-full border border-line bg-white py-3.5 text-[12px] font-medium text-deep transition active:scale-[0.98]"
          >
            从一座岛继续探索
          </button>
          <button type="button" onClick={onHome} className="mx-auto block text-[11px] text-muted">
            回到首页
          </button>
        </div>

        <p className="pb-2 pt-8 text-center text-[10px] text-muted">
          下一座岛，随时可以跳 · 不着急给人生下结论
        </p>
      </div>
    </div>
  )
}
