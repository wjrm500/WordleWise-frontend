import { getDateFromStr, getTodayDate } from "./dates"

// Helper function to convert the nested week-based data structure into a flat array of daily records
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

// Calculate winning streaks where one player beats the other
// A player wins when they score lower than their opponent - ties don't count as wins
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
      currentStreak.periodEnd = day.Date
      // Update periodStart based on the streak length
      const startDate = new Date(day.Date)
      startDate.setDate(startDate.getDate() - (currentStreak.days - 1))
      currentStreak.periodStart = startDate.toISOString().slice(0, 10)
      streaks.push(currentStreak)
    } else if (currentWinner) {
      streaks.push({
        user: currentWinner, 
        days: 1, 
        periodStart: day.Date,
        periodEnd: day.Date
      })
    }
    previousWinner = currentWinner
  })
  streaks.sort((a, b) => {
    if (b.days !== a.days) {
      return b.days - a.days
    } else {
      return new Date(a.periodEnd) - new Date(b.periodEnd)
    }
  })
  return streaks
}

// Calculate streaks where a player wasn't beaten (they either won or tied)
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
        let periodEnd = new Date(day.Date)
        periodEnd.setTime(periodEnd.getTime() - 86400000)
        const periodEndStr = periodEnd.toISOString().slice(0, 10)
        // Calculate period start based on streak length
        let periodStart = new Date(periodEnd)
        periodStart.setDate(periodStart.getDate() - (days - 1))
        const periodStartStr = periodStart.toISOString().slice(0, 10)
        streaks.push({
          user: currentLoser, 
          days,
          periodStart: periodStartStr,
          periodEnd: periodEndStr
        })
      }
      currentStreaks[currentLoser] = 0
    }
    finalDate = day.Date
  })

  // Handle ongoing streaks
  for (let user of ["kjem500", "wjrm500"]) {
    if (currentStreaks[user] > 0) {
      const periodStart = new Date(finalDate)
      periodStart.setDate(periodStart.getDate() - (currentStreaks[user] - 1))
      streaks.push({
        user,
        days: currentStreaks[user],
        periodStart: periodStart.toISOString().slice(0, 10),
        periodEnd: finalDate
      })
    }
  }

  return sortRecords(streaks)
}

// Calculate streaks where a player scored at or below a certain threshold
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
    for (let user of ["kjem500", "wjrm500"]) {
      if ((day[user] || 8) <= X) {
        currentStreaks[user]++
      } else {
        let days = currentStreaks[user]
        if (days > 0) {
          let periodEnd = new Date(day.Date)
          periodEnd.setTime(periodEnd.getTime() - 86400000)
          const periodEndStr = periodEnd.toISOString().slice(0, 10)
          // Calculate period start
          let periodStart = new Date(periodEnd)
          periodStart.setDate(periodStart.getDate() - (days - 1))
          const periodStartStr = periodStart.toISOString().slice(0, 10)
          streaks.push({
            user,
            days,
            periodStart: periodStartStr,
            periodEnd: periodEndStr
          })
        }
        currentStreaks[user] = 0
      }
    }
    finalDate = day.Date
  })

  for (let user of ["kjem500", "wjrm500"]) {
    if (currentStreaks[user] > 0) {
      const periodStart = new Date(finalDate)
      periodStart.setDate(periodStart.getDate() - (currentStreaks[user] - 1))
      streaks.push({
        user,
        days: currentStreaks[user],
        periodStart: periodStart.toISOString().slice(0, 10),
        periodEnd: finalDate
      })
    }
  }

  return sortRecords(streaks)
}

// Core function to calculate total scores within a given date range
const getLowestScoreInPeriod = (data, startDate, endDate) => {
  let userTotals = {
    "kjem500": { total: 0 },
    "wjrm500": { total: 0 }
  }
  
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  const dates = []
  const current = new Date(start)
  while (current <= end) {
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
    current.setDate(current.getDate() + 1)
  }
  
  const scoresByDate = {}
  flattenData(data).forEach(day => {
    if (day.Date) {
      scoresByDate[day.Date] = day
    }
  })
  
  dates.forEach(date => {
    const dayData = scoresByDate[date] || {}
    for (let user of ["kjem500", "wjrm500"]) {
      userTotals[user].total += (dayData[user] || 8)
    }
  })

  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const results = []
  for (let [user, stats] of Object.entries(userTotals)) {
    results.push({
      user: user,
      score: stats.total,
      periodStart: formatDate(startDate),
      periodEnd: formatDate(endDate)
    })
  }
  
  return results
}

// Period-based record calculation functions remain largely the same
// but with endDate renamed to periodEnd in their results

const getWeeklyRecords = (data) => {
  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const firstPossibleDate = new Date('2022-10-24')
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - lastPossibleDate.getDay())
  
  const startDate = new Date(firstPossibleDate)
  const daysUntilMonday = (8 - startDate.getDay()) % 7
  startDate.setDate(startDate.getDate() + daysUntilMonday)
  
  const currentDate = new Date(startDate)
  while (currentDate <= lastPossibleDate) {
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(currentDate.getDate() + 6)
    
    const results = getLowestScoreInPeriod(data, currentDate, weekEnd)
    records.push(...results)
    
    currentDate.setDate(currentDate.getDate() + 7)
  }
  
  return sortRecords(records)
}

const getRollingPeriodRecords = (data, days) => {
  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []
  
  const firstPossibleDate = new Date('2022-10-24')
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - days + 1)
  
  const currentDate = new Date(firstPossibleDate)
  while (currentDate <= lastPossibleDate) {
    const periodEnd = new Date(currentDate)
    periodEnd.setDate(currentDate.getDate() + days - 1)
    
    const results = getLowestScoreInPeriod(data, currentDate, periodEnd)
    records.push(...results)
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return sortRecords(records)
}

const getFortnightRecords = (data) => {
  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const firstPossibleDate = new Date('2022-10-24')
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - lastPossibleDate.getDay())
  
  const startDate = new Date(firstPossibleDate)
  const daysUntilMonday = (8 - startDate.getDay()) % 7
  startDate.setDate(startDate.getDate() + daysUntilMonday)
  
  const currentDate = new Date(startDate)
  while (currentDate <= lastPossibleDate) {
    const periodEnd = new Date(currentDate)
    periodEnd.setDate(currentDate.getDate() + 13)
    
    const results = getLowestScoreInPeriod(data, currentDate, periodEnd)
    records.push(...results)
    
    currentDate.setDate(currentDate.getDate() + 14)
  }
  
  return sortRecords(records)
}

const getMonthlyRecords = (data) => {
  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const firstPossibleDate = new Date(2022, 10, 1)
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(1)
  lastPossibleDate.setDate(0)
  
  const currentDate = new Date(firstPossibleDate)
  while (currentDate <= lastPossibleDate) {
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const results = getLowestScoreInPeriod(data, currentDate, monthEnd)
    records.push(...results)
    
    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(1)
  }
  
  return sortRecords(records)
}

// Helper function to sort records by days or score, then by date
const sortRecords = (records) => {
  return records.sort((a, b) => {
    const isStreak = a.days !== undefined
    
    if (isStreak) {
      // For streaks, sort by days descending (higher numbers first)
      if (a.days !== b.days) {
        return b.days - a.days  // Descending order for streaks
      }
    } else {
      // For period scores, sort by score ascending (lower numbers first)
      if (a.score !== b.score) {
        return a.score - b.score  // Ascending order for scores
      }
    }
    
    // For equal values, sort by date (earlier dates first)
    return new Date(a.periodStart) - new Date(b.periodStart)
  })
}

export {
  getWinStreaks,
  getUnbeatenStreaks,
  getXOrBelowStreaks,
  getWeeklyRecords,
  getRollingPeriodRecords,
  getFortnightRecords,
  getMonthlyRecords
}