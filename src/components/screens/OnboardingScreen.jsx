import { useState } from 'react'
import data from '../../data/index.js'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import CharRing from '../ui/CharRing.jsx'
import Pill from '../ui/Pill.jsx'

export default function OnboardingScreen({ onFinish, onSkip }) {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState([])
  const [nickname, setNickname] = useState('')

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="flex min-h-full flex-col bg-page px-6 pb-10 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-primary">ISLAND HOP</p>
          <p className="mt-1 text-[15px] font-semibold text-ink">跳岛</p>
        </div>
        <Pill tone="glass">STEP {step}/2</Pill>
      </div>

      <div className="mt-7 flex gap-1.5">
        <span className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-deep' : 'bg-line'}`} />
        <span className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-deep' : 'bg-line'}`} />
      </div>

      {step === 1 ? (
        <div className="rise mt-9">
          <p className="text-[11px] font-medium tracking-[0.2em] text-primary">01 / YOUR CURIOSITY</p>
          <h1 className="mt-3 text-[27px] font-bold leading-[1.35] tracking-tight text-ink">
            选择你的兴趣与好奇
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-muted">
            不用想清楚为什么。选中几个让你愿意多看一眼的方向就够了。
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {data.interestOptions.map((item) => {
              const active = selected.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border transition active:scale-95 ${
                    active ? 'border-mist bg-mist text-deep shadow-card' : 'border-line bg-white text-ink'
                  }`}
                >
                  <CharRing glyph={item.glyph} size={34} />
                  <span className="text-[12px] font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          <p className="mt-5 text-center text-[11px] text-muted">
            已选 {selected.length} 个 · 随便选，之后都可以改
          </p>
        </div>
      ) : (
        <div className="rise mt-9">
          <p className="text-[11px] font-medium tracking-[0.2em] text-primary">02 / YOUR NAME</p>
          <h1 className="mt-3 text-[27px] font-bold leading-[1.35] tracking-tight text-ink">
            怎么称呼你？
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-muted">
            跳岛日志会记下你走过的岛，但不会替你下结论。
          </p>

          <div className="mt-8 rounded-card bg-white p-5 shadow-card">
            <label htmlFor="nickname" className="text-[11px] font-medium text-muted">
              昵称
            </label>
            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="林漫"
              maxLength={12}
              className="mt-2 w-full border-b border-line pb-3 text-[19px] font-semibold text-ink outline-none placeholder:text-mist focus:border-primary"
            />
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-page px-4 py-3">
              <span className="text-[12px] text-muted">跳岛日志从第 {data.user.islandDays} 天开始</span>
              <span className="text-[12px] font-semibold text-deep">{selected.length} 个兴趣</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-mist/70 bg-mistlight/60 px-4 py-4">
            <p className="text-[12px] leading-6 text-deep">
              这里没有测评，也没有答案。只有一座座岛，等你上去看看。
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-10">
        <CapsuleButton
          onClick={() => (step === 1 ? setStep(2) : onFinish({ interests: selected, nickname }))}
        >
          {step === 1 ? '下一步' : '开始我的探索'}
        </CapsuleButton>
        <button
          type="button"
          onClick={onSkip}
          className="mx-auto mt-4 block text-[12px] text-muted underline decoration-line underline-offset-4"
        >
          跳过，先随便逛逛
        </button>
      </div>
    </div>
  )
}
