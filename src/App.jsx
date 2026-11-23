import { useCallback, useEffect, useRef, useState } from 'react'
import data, { findIsland, findLevel, journalSeed, user } from './data/index.js'
import {
  buildInsight,
  buildJournalEntry,
  deriveOutcome,
  getRecommendations,
  updatePreferences,
} from './data/recommend.js'

import Toast from './components/ui/Toast.jsx'
import BottomNav from './components/ui/BottomNav.jsx'
import ActionSheet from './components/ui/ActionSheet.jsx'

import OnboardingScreen from './components/screens/OnboardingScreen.jsx'
import HomeScreen from './components/screens/HomeScreen.jsx'
import MapScreen from './components/screens/MapScreen.jsx'
import DetailScreen from './components/screens/DetailScreen.jsx'
import ExperienceScreen from './components/screens/ExperienceScreen.jsx'
import DiaryScreen from './components/screens/DiaryScreen.jsx'
import ResultScreen from './components/screens/ResultScreen.jsx'
import JournalScreen from './components/screens/JournalScreen.jsx'
import UnlockScreen from './components/screens/UnlockScreen.jsx'

const MAIN_SCREENS = ['home', 'map', 'unlock', 'journal']

const initialDiary = {
  funParts: ['f_edit'],
  hardParts: ['h_shoot'],
  excitement: 5,
  feelings: data.diaryOptions.feelings.map((item) => ({ ...item, on: item.defaultOn })),
  discovery: '',
}

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [stack, setStack] = useState([])
  const [profile, setProfile] = useState({ ...user, interests: [] })
  const [selectedIslandId, setSelectedIslandId] = useState('coffee')
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [levelId, setLevelId] = useState('light')
  const [filter, setFilter] = useState('recommend')
  const [tasksDone, setTasksDone] = useState(['t1', 't2'])
  const [mood, setMood] = useState(null)
  const [diary, setDiary] = useState(initialDiary)
  const [outcome, setOutcome] = useState('leave')
  const [previewOutcome, setPreviewOutcome] = useState(null)
  const [records, setRecords] = useState(journalSeed.records)
  const [preferences, setPreferences] = useState(journalSeed.preferences)
  const [insight, setInsight] = useState(journalSeed.insight)
  const [booking, setBooking] = useState(null)
  const [flowEntryId, setFlowEntryId] = useState(null)
  const [toast, setToast] = useState('')
  const [location, setLocation] = useState(user.location)
  const [sheetType, setSheetType] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((message) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const navigate = (next) => {
    setStack((prev) => [...prev, screen])
    setScreen(next)
  }

  const goBack = () => {
    const previous = stack[stack.length - 1] || 'home'
    setStack((prev) => prev.slice(0, -1))
    setScreen(previous)
  }

  const openIsland = (islandId, storeId = null) => {
    setSelectedIslandId(islandId)
    setSelectedStoreId(storeId)
    setFilter('recommend')
    navigate('detail')
  }

  const pickLocation = (value) => {
    const next = value?.trim()
    if (!next) return
    setLocation(next)
    setSheetType(null)
    showToast(`定位已更新 · ${next}`)
  }

  const handleOnboarding = ({ interests, nickname }) => {
    setProfile((prev) => ({ ...prev, interests, nickname: nickname.trim() || prev.nickname }))
    showToast('兴趣线索已记下，先跳一座岛试试')
    navigate('home')
  }

  const handleBook = () => {
    const island = findIsland(selectedIslandId)
    const level = findLevel(levelId)
    setBooking({ islandId: island.id, levelId: level.id })
    setTasksDone(['t1'])
    setMood(null)
    showToast(`预约成功 · ${island.name} ${level.name}`)
    navigate('experience')
  }

  const handleDiarySubmit = (nextDiary) => {
    const island = findIsland(selectedIslandId)
    const level = findLevel(levelId)
    const result = deriveOutcome(nextDiary)
    const entry = buildJournalEntry({ island, level, diary: nextDiary, outcome: result, day: profile.islandDays })

    setDiary(nextDiary)
    setOutcome(result)
    setPreviewOutcome(null)
    setFlowEntryId(entry.id)
    setRecords((prev) => [entry, ...prev])
    setPreferences((prev) => updatePreferences(prev, nextDiary, result))
    setInsight(buildInsight({ diary: nextDiary, outcome: result, island }))
    showToast('体验日记已收进跳岛日志')
    navigate('result')
  }

  const island = findIsland(selectedIslandId)
  const level = findLevel(levelId)
  const activeOutcome = previewOutcome || outcome
  const recommendations = getRecommendations({
    diary,
    journalRecords: records.filter((record) => record.id !== flowEntryId),
    currentIslandId: selectedIslandId,
    outcome: activeOutcome,
  })

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return <OnboardingScreen onFinish={handleOnboarding} onSkip={() => handleOnboarding({ interests: user.interests, nickname: user.nickname })} />
      case 'home':
        return (
          <HomeScreen
            profile={{ ...profile, location }}
            selectedIslandId={selectedIslandId}
            booking={booking}
            onSelectIsland={setSelectedIslandId}
            onOpenDetail={openIsland}
            onOpenMap={() => navigate('map')}
            onEditLocation={() => setSheetType('location')}
            onContinue={() => (booking ? navigate('experience') : openIsland(selectedIslandId))}
          />
        )
      case 'map':
        return (
          <MapScreen
            location={location}
            selectedIslandId={selectedIslandId}
            selectedStoreId={selectedStoreId}
            onOpenDetail={openIsland}
            onEditLocation={() => setSheetType('location')}
          />
        )
      case 'detail':
        return (
          <DetailScreen
            island={island}
            storeId={selectedStoreId}
            levelId={levelId}
            filter={filter}
            onFilterChange={setFilter}
            onSelectLevel={setLevelId}
            onBook={handleBook}
            onBack={goBack}
            onOpenIsland={openIsland}
          />
        )
      case 'experience':
        return (
          <ExperienceScreen
            island={island}
            level={level}
            tasksDone={tasksDone}
            onToggleTask={(id) => setTasksDone((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))}
            mood={mood}
            onMood={setMood}
            onFinish={() => navigate('diary')}
            onBack={goBack}
          />
        )
      case 'diary':
        return <DiaryScreen island={island} initialDiary={diary} onSubmit={handleDiarySubmit} onBack={goBack} />
      case 'result':
        return (
          <ResultScreen
            island={island}
            level={level}
            diary={diary}
            outcome={activeOutcome}
            recommendations={recommendations}
            onPreviewChange={setPreviewOutcome}
            onJournal={() => { setStack([]); setScreen('journal') }}
            onHome={() => { setStack([]); setScreen('home') }}
            onOpenIsland={openIsland}
          />
        )
      case 'unlock':
        return (
          <UnlockScreen
            records={records}
            onOpenIsland={openIsland}
            onLocked={() => showToast('这座岛还没登过，先去预约试试')}
          />
        )
      case 'journal':
        return (
          <JournalScreen
            profile={profile}
            records={records}
            preferences={preferences}
            insight={insight}
            onOpenIsland={openIsland}
            onHome={() => navigate('home')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      <Toast message={toast} />
      <div className={MAIN_SCREENS.includes(screen) ? 'min-h-full pb-28' : 'min-h-full'}>
        {renderScreen()}
      </div>

      {MAIN_SCREENS.includes(screen) && (
        <BottomNav
          active={screen}
          onNavigate={(target) => { setStack([]); setScreen(target) }}
          onPlus={() => setSheetType('plus')}
        />
      )}

      <ActionSheet
        open={Boolean(sheetType)}
        type={sheetType || 'plus'}
        location={location}
        onPickLocation={pickLocation}
        onCustomLocation={pickLocation}
        onClose={() => setSheetType(null)}
        items={[
          { label: '再跳一座岛', desc: '回到首页，看看今天的推荐', onClick: () => { setStack([]); setScreen('home') } },
          { label: '继续上次体验', desc: booking ? `${findIsland(booking.islandId).name} · ${findLevel(booking.levelId).name}` : '还没有进行中的体验', onClick: () => (booking ? setScreen('experience') : openIsland('coffee')) },
          { label: '跳岛地图', desc: '看看你点亮了哪些岛', onClick: () => { setStack([]); setScreen('unlock') } },
          { label: '看看跳岛日志', desc: '你走过的每一座岛都记在那里', onClick: () => { setStack([]); setScreen('journal') } },
        ]}
      />
    </div>
  )
}
