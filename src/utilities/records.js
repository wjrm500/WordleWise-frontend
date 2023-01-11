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

const getUnbeatenStreaks = (data) => {
  let currentUnbeatenStreaks = {"Kate": 0, "Will": 0}
  let unbeatenStreaks = []
  let finalDate
  let todayDate = new Date()
  let todayYear = todayDate.getFullYear()
  let todayMonth = todayDate.getMonth() + 1
  let todayDay = todayDate.getDate()
  console.log(todayDay)
  data.flat().forEach(day => {
    let [dayYear, dayMonth, dayDay] = day.Date.split("-").map(x => parseInt(x, 10))
    if (dayYear > todayYear) {
      return
    } else if (dayYear == todayYear) {
      if (dayMonth > todayMonth) {
        return
      } else if (dayMonth == todayMonth) {
        if (dayDay > todayDay) {
          return
        }
      }
    }
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
  if (currentUnbeatenStreaks.Kate > 0) {
    unbeatenStreaks.push({player: "Will", numDays: currentUnbeatenStreaks.Will, endDate: finalDate})
  }
  unbeatenStreaks.sort((a, b) => {
    if (b.numDays !== a.numDays) {
      return b.numDays - a.numDays
    } else {
      return new Date(a.endDate) - new Date(b.endDate)
    }
  })
  return unbeatenStreaks.slice(0, 5)
}

export {getWinStreaks, getUnbeatenStreaks}