import Card from '../ui/Card.jsx'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import CharRing from '../ui/CharRing.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'
import { ArrowRight, ChevronRight, Compass, Spark } from '../ui/Icons.jsx'
import { deriveOutcome } from '../../data/recommend.js'

export default function ResultScreen({ island, level, diary, outcome, recommendations, onPreviewChange, onJournal, onHome, onOpenIsland }) {
  const actualOutcome = deriveOutcome(diary)
  const isPreview = outcome !== actualOutcome
  const leave = outcome === 'leave'

  return (
    <div className="min-h-full bg-page pb-10">
      <GradientHeader className="px-5 pb-14 pt-10">
        <div className="flex items-start justify-between">
          <Pill tone="glass">EXPLORATION RECORD</Pill>
          <div className="glass-strong grid h-[70px] w-[70px] place-items-center rounded-full text-deep">
            <Compass className="h-9 w-9" />
          </div>
        </div>
        <p className="mt-8 text-[11px] text-deep/80">{island.name} · {level.name} · 今天</p>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.35] tracking-tight text-ink">
          {leave ? '这座岛，你登过了' : '这座岛，你想再登一次'}
        </h1>
        <p className="mt-3 max-w-[300px] text-[12px] leading-6 text-deep/80">
          {leave
            ? '登过一座岛、看过、决定不留下，你排除掉一个可能不适合的方向，也省下了未来几个月的纠结。'
            : '喜欢也不需要马上变成答案。你想再靠近一点，就把它记进跳岛日志，继续观察。'}
        </p>
        {isPreview && (
          <p className="mt-4 inline-block rounded-full bg-white/50 px-3 py-1.5 text-[10px] text-deep">
            预览中 · 本次记录仍为「{actualOutcome === 'leave' ? '离岛排除' : '想再登岛'}」
          </p>
        )}
      </GradientHeader>

      <div className="overlap -mt-6 px-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            ['+1', '登岛完成', 'green'],
            [leave ? '+1' : '+1', leave ? '离岛排除' : '想再登岛', leave ? 'muted' : 'green'],
            ['+2', '自我新发现', 'primary'],
          ].map(([value, label, tone]) => (
            <Card key={label} className="px-2 py-4 text-center">
              <p className={`text-[20px] font-bold ${tone === 'green' ? 'text-[#5F8F52]' : tone === 'primary' ? 'text-primary' : 'text-muted'}`}>{value}</p>
              <p className="mt-1 text-[10px] text-muted">{label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold text-ink">推荐下一座岛</h2>
            <span className="text-[10px] text-muted">基于这次反馈</span>
          </div>
          <div className="space-y-2.5">
            {recommendations.map(({ island: next, tags, note }) => (
              <Card key={next.id} onClick={() => onOpenIsland(next.id)} className="p-4">
                <div className="flex items-center gap-3">
                  <CharRing glyph={next.glyph} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[14px] font-semibold text-ink">{next.name}</p>
                      <span className="shrink-0 text-[12px] font-semibold text-deep">¥{next.price}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-muted">{next.en} · {next.distance} · {next.duration}</p>
                  </div>
                  <ChevronRight className="shrink-0 text-muted" />
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-deep">{note}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Pill key={tag} tone={tag.startsWith('避开') ? 'red' : 'green'}>{tag}</Pill>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-5 flex items-start gap-3 bg-mistlight/60 p-4 shadow-none">
          <Spark className="mt-0.5 shrink-0 text-primary" />
          <p className="text-[11px] leading-5 text-deep">
            推荐只是下一座岛的候选，不是答案。不想去，就先放着。
          </p>
        </Card>

        <div className="mt-7 space-y-3">
          <CapsuleButton variant="dark" onClick={onJournal}>去看看跳岛日志</CapsuleButton>
          <button type="button" onClick={onHome} className="mx-auto flex items-center gap-1.5 text-[12px] font-medium text-primary">
            再跳一座岛 <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPreviewChange(isPreview ? null : leave ? 'stay' : 'leave')}
            className="mx-auto block text-[10px] text-muted underline decoration-line underline-offset-4"
          >
            {isPreview ? '回到本次结果' : '看看另一种结果'}
          </button>
        </div>

        <p className="pb-2 pt-8 text-center text-[10px] text-muted">
          下一座岛，随时可以跳 · 不着急给人生下结论
        </p>
      </div>
    </div>
  )
}
