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
  let currentUnbeatenStreaks = {"Kate": 0, "Will": 0}
  let unbeatenStreaks = []
  let finalDate
  const now = new Date()
  const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  data.flat().forEach(day => {
    let currentDate = new Date(day.Date)
    if (currentDate > todayDate) return
    let currentWinner = day.Kate < day.Will ? "Kate" : day.Will < day.Kate ? "Will" : null
    let currentLoser = day.Kate > day.Will ? "Kate" : day.Will > day.Kate ? "Will" : null
    if (currentWinner == null) {
      currentUnbeatenStreaks.Kate++
      currentUnbeatenStreaks.Will++
    } else {
      currentUnbeatenStreaks[currentWinner]++
      let numDays = currentUnbeatenStreaks[currentLoser]
      if (numDays > 0) {
        let endDate = new Date(day.Date)
        endDate.setTime(endDate.getTime() - 86400000)
        endDate = endDate.toISOString().slice(0, 10)
        unbeatenStreaks.push({player: currentLoser, numDays, endDate})
      }
      currentUnbeatenStreaks[currentLoser] = 0
    }
    finalDate = day.Date
  })
  if (currentUnbeatenStreaks.Kate > 0) {
    unbeatenStreaks.push({player: "Kate", numDays: currentUnbeatenStreaks.Kate, endDate: finalDate})
  }
  if (currentUnbeatenStreaks.Will > 0) {
    unbeatenStreaks.push({player: "Will", numDays: currentUnbeatenStreaks.Will, endDate: finalDate})
  }
  unbeatenStreaks.sort((a, b) => {
    if (b.numDays !== a.numDays) {
      return b.numDays - a.numDays
    } else {
      return new Date(a.endDate) - new Date(b.endDate)
    }
  })
  return unbeatenStreaks
}

export {getWinStreaks, getUnbeatenStreaks}