import { useState } from 'react'
import data from '../../data/index.js'
import Card from '../ui/Card.jsx'
import CapsuleButton from '../ui/CapsuleButton.jsx'
import GradientHeader from '../ui/GradientHeader.jsx'
import Toggle from '../ui/Toggle.jsx'
import BackBar from '../ui/BackBar.jsx'

const EXCITEMENT_LABELS = ['几乎没什么感觉', '有一点点好奇', '还算平静', '有一点投入', '比较投入', '挺兴奋的', '很兴奋', '非常兴奋', '几乎不想停', '完全沉浸']

export default function DiaryScreen({ island, initialDiary, onSubmit, onBack }) {
  const [diary, setDiary] = useState(initialDiary)

  const togglePart = (key, id) => {
    setDiary((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((item) => item !== id) : [...prev[key], id],
    }))
  }

  const setFeeling = (id, on) => {
    setDiary((prev) => ({
      ...prev,
      feelings: prev.feelings.map((item) => (item.id === id ? { ...item, on } : item)),
    }))
  }

  return (
    <div className="min-h-full bg-page pb-12">
      <GradientHeader className="px-5 pb-9 pt-5">
        <BackBar onBack={onBack} right={<span className="text-[10px] text-deep/70">STEP 7/8</span>} />
        <p className="mt-4 text-[10px] font-semibold tracking-[0.22em] text-deep/70">EXPERIENCE JOURNAL</p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-ink">体验日记</h1>
        <p className="mt-2 text-[12px] leading-5 text-deep/80">
          这次不是评价商家，是记下你自己的感受。<br />{island.name} · 今天
        </p>
      </GradientHeader>

      <div className="space-y-3.5 px-5 pt-5">
        <Card className="p-5">
          <p className="text-[12px] font-semibold text-ink">01 · 哪个环节最有意思？<span className="ml-1 font-normal text-muted">可多选</span></p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.diaryOptions.funParts.map((item) => {
              const active = diary.funParts.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePart('funParts', item.id)}
                  className={`rounded-full border px-3.5 py-2 text-[11px] transition active:scale-95 ${
                    active ? 'border-primary bg-mist text-deep' : 'border-line bg-white text-muted'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-semibold text-ink">02 · 哪个环节最困难？<span className="ml-1 font-normal text-muted">可多选</span></p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.diaryOptions.hardParts.map((item) => {
              const active = diary.hardParts.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePart('hardParts', item.id)}
                  className={`rounded-full border px-3.5 py-2 text-[11px] transition active:scale-95 ${
                    active ? 'border-off/50 bg-off/15 text-[#B05D56]' : 'border-line bg-white text-muted'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-muted">困难不是扣分，它只是告诉你这座岛哪块石头硌脚。</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[12px] font-semibold text-ink">03 · 此刻的兴奋程度</p>
            <span className="text-[13px] font-bold text-deep">{diary.excitement}<span className="text-[10px] font-normal text-muted"> / 10</span></span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={diary.excitement}
            onChange={(event) => setDiary((prev) => ({ ...prev, excitement: Number(event.target.value) }))}
            style={{ '--range-progress': `${((diary.excitement - 1) / 9) * 100}%` }}
            className="range-slider mt-5"
            aria-label="兴奋程度"
          />
          <div className="mt-3 flex justify-between text-[10px] text-muted">
            <span>平静</span>
            <span className="text-primary">{EXCITEMENT_LABELS[diary.excitement - 1]}</span>
            <span>兴奋</span>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-semibold text-ink">04 · 这些感受像你吗？</p>
          <div className="mt-4 space-y-2.5">
            {data.diaryOptions.feelings.map((item) => (
              <Toggle
                key={item.id}
                label={item.label}
                tone={item.tone}
                checked={diary.feelings.find((feeling) => feeling.id === item.id)?.on || false}
                onChange={(on) => setFeeling(item.id, on)}
              />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-semibold text-ink">05 · 有没有一点意外发现？</p>
          <textarea
            value={diary.discovery}
            onChange={(event) => setDiary((prev) => ({ ...prev, discovery: event.target.value }))}
            placeholder="比如：我以为自己会不喜欢和陌生人说话，结果那一段最有意思……"
            rows={4}
            maxLength={160}
            className="mt-3 w-full resize-none rounded-2xl bg-page p-4 text-[12px] leading-6 text-ink outline-none placeholder:text-muted focus:ring-1 focus:ring-primary"
          />
          <p className="mt-2 text-right text-[10px] text-muted">{diary.discovery.length} / 160</p>
        </Card>

        <div className="pt-2">
          <CapsuleButton onClick={() => onSubmit(diary)}>生成我的探索记录</CapsuleButton>
          <p className="mt-3 text-center text-[10px] leading-5 text-muted">
            没有标准答案，这只是你给自己的一个观察位置。
          </p>
        </div>
      </div>
    </div>
  )
}
