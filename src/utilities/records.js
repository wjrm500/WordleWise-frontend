const getWinStreaks = (data) => {
  let previousWinner = null
  let streaks = []
  data.flat().forEach(day => {
    let currentWinner = day.Kate < day.Will ? "Kate" : day.Will < day.Kate ? "Will" : null
    if (currentWinner && currentWinner === previousWinner) {
      let currentStreak = streaks.pop()
      currentStreak.numDays++
      currentStreak.endDate = day.Date
      streaks.push(currentStreak)
    } else if (currentWinner) {
      streaks.push({player: currentWinner, numDays: 1, endDate: day.Date})
    }
    previousWinner = currentWinner
  })
  streaks.sort((a, b) => {
    if (b.numDays !== a.numDays) {
      return b.numDays - a.numDays
    } else {
      return new Date(a.endDate) - new Date(b.endDate)
    }
  })
  return streaks.slice(0, 5)
}

export {getWinStreaks}