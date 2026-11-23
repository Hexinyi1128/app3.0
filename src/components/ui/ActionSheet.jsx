import { ArrowRight, Check } from './Icons.jsx'

const LOCATIONS = ['上海 · 静安 · 3km 内', '上海 · 徐汇 · 5km 内', '北京 · 朝阳 · 3km 内', '杭州 · 西湖 · 4km 内']

export default function ActionSheet({ open, type = 'plus', items = [], location, onPickLocation, onCustomLocation, onClose }) {
  if (!open) return null
  const isLocation = type === 'location'

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" />
      <div
        className="rise relative mx-auto w-full max-w-[375px] rounded-t-sheet bg-white p-5 pb-8 shadow-float sm:mb-5 sm:rounded-b-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />
        <p className="mb-1 text-[15px] font-semibold text-ink">{isLocation ? '你在哪里跳岛？' : '现在想做什么？'}</p>
        {isLocation && <p className="mb-4 text-[11px] text-muted">切换后，附近推荐会跟着更新。</p>}

        <div className="space-y-2.5">
          {isLocation ? (
            <>
              {LOCATIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPickLocation(item)}
                  className="flex w-full items-center justify-between rounded-2xl bg-page px-4 py-3.5 text-left transition active:scale-[0.99]"
                >
                  <span>
                    <span className="block text-[13px] font-medium text-ink">{item}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">{item === location ? '当前定位' : '切换到这里'}</span>
                  </span>
                  {item === location ? <Check className="text-primary" /> : <ArrowRight className="text-primary" />}
                </button>
              ))}
              <div className="flex gap-2 pt-1">
                <input id="custom-location" placeholder="或输入自定义地点" className="min-w-0 flex-1 rounded-2xl border border-line px-3 py-3 text-[12px] outline-none focus:border-primary" />
                <button type="button" onClick={() => onCustomLocation(document.getElementById('custom-location')?.value)} className="rounded-2xl bg-deep px-4 text-[12px] font-semibold text-white">确定</button>
              </div>
            </>
          ) : (
            items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onClose()
                  item.onClick()
                }}
                className="flex w-full items-center justify-between rounded-2xl bg-page px-4 py-3.5 text-left transition active:scale-[0.99]"
              >
                <span>
                  <span className="block text-[13px] font-medium text-ink">{item.label}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">{item.desc}</span>
                </span>
                <ArrowRight className="text-primary" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
