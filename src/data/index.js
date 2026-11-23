import data from './islandHop.json'

export const {
  user,
  interestOptions,
  levels,
  islands,
  stores,
  tasks,
  mentorTips,
  moods,
  diaryOptions,
  journalSeed,
  recommendRules,
} = data

export const findIsland = (id) => islands.find((item) => item.id === id)
export const findStore = (id) => stores.find((item) => item.id === id)
export const findLevel = (id) => levels.find((item) => item.id === id)

export default data
