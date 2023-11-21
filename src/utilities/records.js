import { getDateFromStr, getTodayDate } from "./dates"

const flattenData = (data) => {
  const newData = []
  for (let i = 0; i < data.length; i++) {
    for (let date in data[i]["data"]) {
      let day = data[i]["data"][date]
      day["Date"] = date
      newData.push(day)
    }
  }
  return newData
}

const getWinStreaks = (data) => {
  let previousWinner = null
  let streaks = []
  flattenData(data).forEach(day => {
    let kateScore = day.kjem500 || 8
    let willScore = day.wjrm500 || 8
    let currentWinner = kateScore < willScore ? "kjem500" : willScore < kateScore ? "wjrm500" : null
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
  let currentStreaks = {"kjem500": 0, "wjrm500": 0}
  let streaks = []
  let finalDate
  const todayDate = getTodayDate()
  flattenData(data).forEach(day => {
    let currentDate = getDateFromStr(day.Date)
    if (currentDate > todayDate) {
      return
    }
    let kateScore = day.kjem500 || 8
    let willScore = day.wjrm500 || 8
    let currentWinner = kateScore < willScore ? "kjem500" : willScore < kateScore ? "wjrm500" : null
    let currentLoser = kateScore > willScore ? "kjem500" : willScore > kateScore ? "wjrm500" : null
    if (currentWinner == null) {
      currentStreaks.kjem500++
      currentStreaks.wjrm500++
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

  for (let player of ["kjem500", "wjrm500"]) {
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
  let currentStreaks = {"kjem500": 0, "wjrm500": 0}
  let streaks = []
  let finalDate
  const todayDate = getTodayDate()
  flattenData(data).forEach(day => {
    let currentDate = getDateFromStr(day.Date)
    if (currentDate > todayDate) {
      return
    }
    for (let player of ["kjem500", "wjrm500"]) {
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

  for (let player of ["kjem500", "wjrm500"]) {
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