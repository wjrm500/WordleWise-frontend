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
  return streaks
}

const getUnbeatenStreaks = (data) => {
  let currentStreaks = {"Kate": 0, "Will": 0}
  let streaks = []
  let finalDate
  const now = new Date()
  const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  data.flat().forEach(day => {
    let currentDate = new Date(day.Date)
    if (currentDate > todayDate) return
    let currentWinner = day.Kate < day.Will ? "Kate" : day.Will < day.Kate ? "Will" : null
    let currentLoser = day.Kate > day.Will ? "Kate" : day.Will > day.Kate ? "Will" : null
    if (currentWinner == null) {
      currentStreaks.Kate++
      currentStreaks.Will++
    } else {
      currentStreaks[currentWinner]++
      let days = currentStreaks[currentLoser]
      if (days > 0) {
        let endDate = new Date(day.Date)
        endDate.setTime(endDate.getTime() - 86400000)
        endDate = endDate.toISOString().slice(0, 10)
        streaks.push({player: currentLoser, days, endDate})
      }
      currentStreaks[currentLoser] = 0
    }
    finalDate = day.Date
  })
  if (currentStreaks.Kate > 0) {
    streaks.push({player: "Kate", days: currentStreaks.Kate, endDate: finalDate})
  }
  if (currentStreaks.Will > 0) {
    streaks.push({player: "Will", days: currentStreaks.Will, endDate: finalDate})
  }
  streaks.sort((a, b) => {
    if (b.days !== a.days) {
      return b.days - a.days
    } else {
      return new Date(a.endDate) - new Date(b.endDate)
    }
  })
  return streaks
}

export {getWinStreaks, getUnbeatenStreaks}