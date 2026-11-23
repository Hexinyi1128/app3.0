import { useEffect, useState } from 'react'
import data from '../../data/index.js'
import Card from '../ui/Card.jsx'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Pill from '../ui/Pill.jsx'
import BackBar from '../ui/BackBar.jsx'
import { Check, Clock } from '../ui/Icons.jsx'

export default function ExperienceScreen({ island, level, tasksDone, onToggleTask, mood, onMood, onFinish, onBack }) {
  const [seconds, setSeconds] = useState(84 * 60 + 16)

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const time = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')

  const doneCount = tasksDone.length
  const complete = doneCount === data.tasks.length

  return (
    <div className="min-h-full bg-page pb-10">
      <GradientHeader className="px-5 pb-16 pt-5">
        <BackBar onBack={onBack} right={<Pill tone="glass">导师带练中</Pill>} />
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-okay shadow-[0_0_0_4px_rgba(168,208,141,0.35)]" />
          <span className="text-[11px] font-medium text-deep">体验进行中</span>
        </div>
        <h1 className="mt-3 text-[27px] font-bold tracking-tight text-ink">登岛：{island.name}</h1>
        <p className="mt-2 text-[12px] text-deep/80">{level.name} · {level.duration} · 不用急，跟着导师走。</p>
        <div className="glass-strong mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2">
          <Clock className="text-deep" />
          <span className="text-[15px] font-semibold tabular-nums tracking-wide text-ink">{time}</span>
        </div>
      </GradientHeader>

      <div className="overlap -mt-7 px-5">
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[16px] font-semibold text-ink">任务进度</h2>
            <span className="text-[12px] font-medium text-primary">{doneCount} / {data.tasks.length} 已完成</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(doneCount / data.tasks.length) * 100}%` }}
            />
          </div>

          <div className="mt-5 space-y-2.5">
            {data.tasks.map((task, index) => {
              const done = tasksDone.includes(task.id)
              const previousDone = data.tasks.slice(0, index).every((item) => tasksDone.includes(item.id))
              const current = !done && previousDone
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${
                    done
                      ? 'border-okay/50 bg-okay/10'
                      : current
                        ? 'border-primary bg-mistlight/70'
                        : 'border-line bg-white'
                  }`}
                >
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                    done ? 'border-okay bg-okay text-ink' : current ? 'border-primary text-transparent' : 'border-line text-transparent'
                  }`}>
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-[13px] font-semibold ${done ? 'text-muted' : 'text-ink'}`}>{task.title}</span>
                      <span className="shrink-0 text-[10px] text-muted">{task.length}</span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-5 text-muted">{task.detail}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="mt-4 border border-mist/60 bg-mistlight/60 p-5 shadow-none">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-primary">MENTOR NOTE</p>
          <p className="mt-2 text-[13px] leading-6 text-deep">“{data.mentorTips[0]}”</p>
          <p className="mt-2 text-[10px] text-muted">— 今天的带练导师</p>
        </Card>

        <div className="mt-6">
          <h2 className="text-[16px] font-semibold text-ink">此刻感觉如何？</h2>
          <p className="mt-1 text-[11px] text-muted">随手记一下，等下写日记时用得上。</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {data.moods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onMood(item.id)}
                className={`rounded-2xl border px-4 py-3.5 text-[12px] font-medium transition active:scale-95 ${
                  mood === item.id ? 'border-deep bg-deep text-white' : 'border-line bg-white text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <CapsuleButton variant="dark" disabled={!complete} onClick={onFinish}>
            {complete ? '完成体验，写日记' : `还有 ${data.tasks.length - doneCount} 个任务`}
          </CapsuleButton>
          {!complete && (
            <p className="mt-3 text-center text-[11px] text-muted">点一下任务卡就能打卡，做不完也可以跳过。</p>
          )}
        </div>
      </div>
    </div>
  )
}
