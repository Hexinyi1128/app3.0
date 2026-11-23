import data from './islandHop.json'
import { findIsland } from './index.js'

const { diaryOptions, recommendRules } = data

const feelingShortLabels = {
  like_talk: '和顾客交流',
  tired_repeat: '重复性动作',
  like_make: '亲手做成品',
}

const signalLabels = Object.fromEntries(
  [
    ...diaryOptions.funParts.map((item) => [item.id, item.label]),
    ...diaryOptions.hardParts.map((item) => [item.id, item.label]),
    ...diaryOptions.feelings.map((item) => [item.id, feelingShortLabels[item.id] || item.label]),
  ],
)

function moodSignals(diary) {
  const signals = []
  ;(diary?.funParts || []).forEach((id) => signals.push({ id, kind: 'like' }))
  ;(diary?.hardParts || []).forEach((id) => signals.push({ id, kind: 'avoid' }))
  ;(diary?.feelings || []).filter((item) => item.on).forEach((item) => {
    signals.push({ id: item.id, kind: item.tone === 'negative' ? 'avoid' : 'like' })
  })
  return signals
}

export function deriveOutcome(diary) {
  const excitement = diary?.excitement ?? 5
  const positive = (diary?.feelings || []).some((item) => item.on && item.tone === 'positive')
  const negative = (diary?.feelings || []).some((item) => item.on && item.tone === 'negative')

  if (excitement >= 7) return 'stay'
  if (excitement <= 4) return 'leave'
  if (positive && !negative) return 'stay'
  if (negative && !positive) return 'leave'
  return (diary?.funParts || []).length >= 2 ? 'stay' : 'leave'
}

export function getRecommendations({ diary, journalRecords = [], currentIslandId, outcome, limit = 2 }) {
  const excluded = new Set(
    journalRecords.filter((record) => record.status === 'excluded').map((record) => record.islandId),
  )
  if (outcome === 'leave' && currentIslandId) excluded.add(currentIslandId)

  const signals = moodSignals(diary)
  const scored = data.islands
    .filter((island) => !excluded.has(island.id))
    .map((island) => {
      let score = recommendRules.base[island.id] || 0
      const tags = []
      const tagSet = new Set()

      signals.forEach((signal) => {
        const weight = recommendRules.signals[signal.id]?.[island.id] || 0
        if (!weight) return
        score += weight
        const label = signalLabels[signal.id]
        if (!label) return
        const tag = `${signal.kind === 'like' ? '喜欢' : '避开'}${label}`
        if (!tagSet.has(tag)) {
          tagSet.add(tag)
          tags.push(tag)
        }
      })

      return {
        island,
        score,
        tags: tags.slice(0, 2),
        note: recommendRules.notes[island.id] || '',
      }
    })
    .sort((a, b) => b.score - a.score || b.island.rating - a.island.rating)

  return scored.slice(0, limit).map((item) => ({
    ...item,
    tags: item.tags.length ? item.tags : ['和你上次的选择不同'],
  }))
}

export function buildJournalEntry({ island, level, diary, outcome, day }) {
  const firstFun = data.diaryOptions.funParts.find((item) => item.id === diary?.funParts?.[0])
  const firstHard = data.diaryOptions.hardParts.find((item) => item.id === diary?.hardParts?.[0])
  const memo = diary?.discovery?.trim()
    || (firstFun ? `最有意思的是${firstFun.label}。` : '')
    || (firstHard ? `${firstHard.label}的过程比想象中难。` : '')
    || '看过一座岛，留下一句还没想清楚的话。'
  const now = new Date()
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

  return {
    id: `r_${now.getTime()}`,
    date,
    islandId: island.id,
    islandName: island.name,
    glyph: island.glyph,
    level: level.name,
    status: outcome === 'stay' ? 'revisit' : 'excluded',
    memo,
    day,
  }
}

export function updatePreferences(preferences, diary, outcome) {
  const delta = { talk: 0, make: 0, feedback: 0, repeat: 0 }
  const fun = diary?.funParts || []
  const hard = diary?.hardParts || []
  const activeFeelings = (diary?.feelings || []).filter((item) => item.on).map((item) => item.id)

  if (fun.includes('f_talk') || activeFeelings.includes('like_talk')) delta.talk += 8
  if (hard.includes('h_talk')) delta.talk -= 7
  if (fun.includes('f_make') || fun.includes('f_finish') || activeFeelings.includes('like_make')) delta.make += 8
  if (fun.includes('f_space')) delta.make += 4
  if (fun.includes('f_shoot') || fun.includes('f_edit')) delta.feedback += 6
  if (fun.includes('f_finish')) delta.feedback += 5
  if (hard.includes('h_repeat') || activeFeelings.includes('tired_repeat')) delta.repeat -= 9
  if (hard.includes('h_detail') || hard.includes('h_solo')) delta.repeat -= 4
  if (outcome === 'stay') delta.feedback += 3

  return preferences.map((item) => ({
    ...item,
    score: Math.max(12, Math.min(96, item.score + (delta[item.id] || 0))),
  }))
}

export function buildInsight({ diary, outcome, island }) {
  const fun = diary?.funParts || []
  const hard = diary?.hardParts || []
  const likePost = fun.includes('f_edit')
  const dislikeShoot = hard.includes('h_shoot')

  if (likePost && dislikeShoot) {
    return `你并不排斥影像这个方向，只是更在意画面形成的过程：拍摄让你消耗，后期修图让你投入。下一次可以离镜头远一点，试试灯光布景或图片编辑。`
  }
  if (outcome === 'stay') {
    return `你在「${island.name}」上给出了正向信号。喜欢不是立刻定下方向的理由，只是多了一条线索：你偏好有明确产出、能看见结果的过程。下一次换一座相似的岛试试。`
  }
  return `「${island.name}」这座岛，你登过了，也决定不留下。排除不是失败——它让你知道，比起重复和独自精细处理，你更在意交流、动手和看得见的反馈。下一次可以挑一座节奏不同的岛。`
}

export function previewIsland(islandId) {
  return findIsland(islandId)
}
