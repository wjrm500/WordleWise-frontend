import { getDateFromStr, getTodayDate } from "./dates"

// Helper to get group_created_at from data if present
const getGroupCreatedAt = (data) => {
  if (data && data.length > 0 && data[0].group_created_at) {
    return data[0].group_created_at
  }
  return null
}

// Helper function to convert the nested week-based data structure into a flat array of daily records
// Respects group_created_at by default
const flattenData = (data) => {
  const groupCreatedAt = getGroupCreatedAt(data)
  const newData = []

  for (let i = 0; i < data.length; i++) {
    for (let date in data[i]["data"]) {
      // Skip days before group creation
      if (groupCreatedAt && date < groupCreatedAt) {
        continue
      }
      let day = { ...data[i]["data"][date] }
      day["Date"] = date
      newData.push(day)
    }
  }
  return newData
}

// Calculate winning streaks where one player beats all others
const getWinStreaks = (data, usernames) => {
  if (!usernames || usernames.length < 2) return []

  let previousWinner = null
  let streaks = []
  const todayDate = getTodayDate()

  flattenData(data).forEach(day => {
    const currentDate = getDateFromStr(day.Date)
    if (currentDate > todayDate) return

    let minScore = Infinity
    let winners = []

    usernames.forEach(username => {
      const score = day[username] || 8
      if (score < minScore) {
        minScore = score
        winners = [username]
      } else if (score === minScore) {
        winners.push(username)
      }
    })

    const currentWinner = winners.length === 1 ? winners[0] : null

    if (currentWinner && currentWinner === previousWinner) {
      let currentStreak = streaks.pop()
      currentStreak.days++
      currentStreak.periodEnd = day.Date
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

  return sortRecords(streaks)
}

// Calculate streaks where a player wasn't beaten
const getUnbeatenStreaks = (data, usernames) => {
  if (!usernames || usernames.length < 2) return []

  const currentStreaks = {}
  usernames.forEach(u => currentStreaks[u] = 0)

  let streaks = []
  let finalDate
  const todayDate = getTodayDate()

  flattenData(data).forEach(day => {
    const currentDate = getDateFromStr(day.Date)
    if (currentDate > todayDate) return

    let minScore = Infinity
    usernames.forEach(username => {
      const score = day[username] || 8
      if (score < minScore) minScore = score
    })

    const unbeaten = []
    const beaten = []

    usernames.forEach(username => {
      const score = day[username] || 8
      if (score === minScore) {
        unbeaten.push(username)
      } else {
        beaten.push(username)
      }
    })

    unbeaten.forEach(username => {
      currentStreaks[username]++
    })

    beaten.forEach(username => {
      const days = currentStreaks[username]
      if (days > 0) {
        let periodEnd = new Date(day.Date)
        periodEnd.setTime(periodEnd.getTime() - 86400000)
        const periodEndStr = periodEnd.toISOString().slice(0, 10)
        let periodStart = new Date(periodEnd)
        periodStart.setDate(periodStart.getDate() - (days - 1))
        const periodStartStr = periodStart.toISOString().slice(0, 10)
        streaks.push({
          user: username,
          days,
          periodStart: periodStartStr,
          periodEnd: periodEndStr
        })
      }
      currentStreaks[username] = 0
    })

    finalDate = day.Date
  })

  usernames.forEach(username => {
    if (currentStreaks[username] > 0) {
      const periodStart = new Date(finalDate)
      periodStart.setDate(periodStart.getDate() - (currentStreaks[username] - 1))
      streaks.push({
        user: username,
        days: currentStreaks[username],
        periodStart: periodStart.toISOString().slice(0, 10),
        periodEnd: finalDate
      })
    }
  })

  return sortRecords(streaks)
}

// Calculate streaks where a player scored at or below a certain threshold
const getXOrBelowStreaks = (data, X, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const currentStreaks = {}
  usernames.forEach(u => currentStreaks[u] = 0)

  let streaks = []
  let finalDate
  const todayDate = getTodayDate()

  flattenData(data).forEach(day => {
    const currentDate = getDateFromStr(day.Date)
    if (currentDate > todayDate) return

    usernames.forEach(username => {
      const score = day[username] || 8
      if (score <= X) {
        currentStreaks[username]++
      } else {
        const days = currentStreaks[username]
        if (days > 0) {
          let periodEnd = new Date(day.Date)
          periodEnd.setTime(periodEnd.getTime() - 86400000)
          const periodEndStr = periodEnd.toISOString().slice(0, 10)
          let periodStart = new Date(periodEnd)
          periodStart.setDate(periodStart.getDate() - (days - 1))
          const periodStartStr = periodStart.toISOString().slice(0, 10)
          streaks.push({
            user: username,
            days,
            periodStart: periodStartStr,
            periodEnd: periodEndStr
          })
        }
        currentStreaks[username] = 0
      }
    })
    finalDate = day.Date
  })

  usernames.forEach(username => {
    if (currentStreaks[username] > 0) {
      const periodStart = new Date(finalDate)
      periodStart.setDate(periodStart.getDate() - (currentStreaks[username] - 1))
      streaks.push({
        user: username,
        days: currentStreaks[username],
        periodStart: periodStart.toISOString().slice(0, 10),
        periodEnd: finalDate
      })
    }
  })

  return sortRecords(streaks)
}

// Core function to calculate total scores within a given date range
const getLowestScoreInPeriod = (data, startDate, endDate, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const groupCreatedAt = getGroupCreatedAt(data)
  const userTotals = {}
  usernames.forEach(u => userTotals[u] = { total: 0, daysCount: 0 })

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
    const dateStr = `${year}-${month}-${day}`
    
    // Skip dates before group creation
    if (!groupCreatedAt || dateStr >= groupCreatedAt) {
      dates.push(dateStr)
    }
    current.setDate(current.getDate() + 1)
  }

  // If no valid dates in this period, return empty
  if (dates.length === 0) return []

  const scoresByDate = {}
  flattenData(data).forEach(day => {
    if (day.Date) {
      scoresByDate[day.Date] = day
    }
  })

  dates.forEach(date => {
    const dayData = scoresByDate[date] || {}
    usernames.forEach(username => {
      userTotals[username].total += (dayData[username] || 8)
      userTotals[username].daysCount++
    })
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
    if (stats.daysCount > 0) {
      results.push({
        user: user,
        score: stats.total,
        periodStart: formatDate(startDate),
        periodEnd: formatDate(endDate)
      })
    }
  }

  return results
}

// Get lowest weekly scores (Mon-Sun calendar weeks)
const getWeeklyRecords = (data, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const groupCreatedAt = getGroupCreatedAt(data)
  const allDates = processedData.map(d => new Date(d.Date)).filter(d => !isNaN(d))
  if (allDates.length === 0) return []

  const firstPossibleDate = new Date(Math.min(...allDates))
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - lastPossibleDate.getDay())

  const startDate = new Date(firstPossibleDate)
  const daysUntilMonday = (8 - startDate.getDay()) % 7
  if (daysUntilMonday > 0) {
    startDate.setDate(startDate.getDate() + daysUntilMonday)
  }

  const currentDate = new Date(startDate)
  while (currentDate <= lastPossibleDate) {
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(currentDate.getDate() + 6)

    const results = getLowestScoreInPeriod(data, currentDate, weekEnd, usernames)
    records.push(...results)

    currentDate.setDate(currentDate.getDate() + 7)
  }

  return sortRecords(records)
}

// Get lowest scores over a rolling period of N days
const getRollingPeriodRecords = (data, days, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const allDates = processedData.map(d => new Date(d.Date)).filter(d => !isNaN(d))
  if (allDates.length === 0) return []

  const firstPossibleDate = new Date(Math.min(...allDates))
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - days + 1)

  const currentDate = new Date(firstPossibleDate)
  while (currentDate <= lastPossibleDate) {
    const periodEnd = new Date(currentDate)
    periodEnd.setDate(currentDate.getDate() + days - 1)

    const results = getLowestScoreInPeriod(data, currentDate, periodEnd, usernames)
    records.push(...results)

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return sortRecords(records)
}

// Get lowest scores over fortnights
const getFortnightRecords = (data, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const allDates = processedData.map(d => new Date(d.Date)).filter(d => !isNaN(d))
  if (allDates.length === 0) return []

  const firstPossibleDate = new Date(Math.min(...allDates))
  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(lastPossibleDate.getDate() - lastPossibleDate.getDay())

  const startDate = new Date(firstPossibleDate)
  const daysUntilMonday = (8 - startDate.getDay()) % 7
  if (daysUntilMonday > 0) {
    startDate.setDate(startDate.getDate() + daysUntilMonday)
  }

  const currentDate = new Date(startDate)
  while (currentDate <= lastPossibleDate) {
    const periodEnd = new Date(currentDate)
    periodEnd.setDate(currentDate.getDate() + 13)

    const results = getLowestScoreInPeriod(data, currentDate, periodEnd, usernames)
    records.push(...results)

    currentDate.setDate(currentDate.getDate() + 14)
  }

  return sortRecords(records)
}

// Get lowest scores by calendar month
const getMonthlyRecords = (data, usernames) => {
  if (!usernames || usernames.length === 0) return []

  const records = []
  const processedData = flattenData(data)
  if (processedData.length === 0) return []

  const allDates = processedData.map(d => new Date(d.Date)).filter(d => !isNaN(d))
  if (allDates.length === 0) return []

  const earliestDate = new Date(Math.min(...allDates))
  const firstPossibleDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1)

  const lastPossibleDate = getTodayDate()
  lastPossibleDate.setDate(1)
  lastPossibleDate.setDate(0)

  const currentDate = new Date(firstPossibleDate)
  while (currentDate <= lastPossibleDate) {
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const results = getLowestScoreInPeriod(data, currentDate, monthEnd, usernames)
    records.push(...results)

    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(1)
  }

  return sortRecords(records)
}

// Helper function to sort records
const sortRecords = (records) => {
  return records.sort((a, b) => {
    const isStreak = a.days !== undefined

    if (isStreak) {
      if (a.days !== b.days) {
        return b.days - a.days
      }
    } else {
      if (a.score !== b.score) {
        return a.score - b.score
      }
    }

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