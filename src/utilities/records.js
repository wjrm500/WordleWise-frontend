const getWinStreaks = (data) => {
  let previousWinner = null
  let streaks = []
  data.flat().forEach(day => {
    let kateScore = day.Kate || 8
    let willScore = day.Will || 8
    let currentWinner = kateScore < willScore ? "Kate" : willScore < kateScore ? "Will" : null
    if (currentWinner && currentWinner === previousWinner) {
      let currentStreak = streaks.pop()
      currentStreak.days++
      currentStreak.endDate = day.Date
      streaks.push(currentStreak)
    } else if (currentWinner) {
      streaks.push({player: currentWinner, days: 1, endDate: day.Date})
    }
    previousWinner = currentWinner
  })
  streaks.sort((a, b) => {
    if (b.days !== a.days) {
      return b.days - a.days
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
    if (currentDate > todayDate) {
      return
    }
    let kateScore = day.Kate || 8
    let willScore = day.Will || 8
    let currentWinner = kateScore < willScore ? "Kate" : willScore < kateScore ? "Will" : null
    let currentLoser = kateScore > willScore ? "Kate" : willScore > kateScore ? "Will" : null
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

  for (let player of ["Kate", "Will"]) {
    if (currentStreaks[player] > 0) {
      streaks.push({player, days: currentStreaks[player], endDate: finalDate})
    }
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

const getXOrBelowStreaks = (data, X) => {
  let currentStreaks = {"Kate": 0, "Will": 0}
  let streaks = []
  let finalDate
  const now = new Date()
  const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  data.flat().forEach(day => {
    let currentDate = new Date(day.Date)
    if (currentDate > todayDate) {
      return
    }
    for (let player of ["Kate", "Will"]) {
      if ((day[player] || 8) <= X) {
        currentStreaks[player]++
      } else {
        let days = currentStreaks[player]
        if (days > 0) {
          let endDate = new Date(day.Date)
          endDate.setTime(endDate.getTime() - 86400000)
          endDate = endDate.toISOString().slice(0, 10)
          streaks.push({player: player, days, endDate})
        }
        currentStreaks[player] = 0
      }
    }
    finalDate = day.Date
  })

  for (let player of ["Kate", "Will"]) {
    if (currentStreaks[player] > 0) {
      streaks.push({player, days: currentStreaks[player], endDate: finalDate})
    }
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

export {getWinStreaks, getUnbeatenStreaks, getXOrBelowStreaks}