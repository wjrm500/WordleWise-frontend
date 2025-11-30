import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ScopeContext from '../contexts/ScopeContext'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

const CHART_COLORS = [
  'rgba(47, 85, 151, 0.8)',
  'rgba(192, 0, 0, 0.8)',
  'rgba(0, 128, 0, 0.8)',
  'rgba(255, 165, 0, 0.8)',
  'rgba(128, 0, 128, 0.8)',
  'rgba(0, 191, 255, 0.8)',
  'rgba(255, 105, 180, 0.8)',
  'rgba(128, 128, 0, 0.8)'
]
const FIXED_SCORES = [1, 2, 3, 4, 5, 6, 8]
const DEFAULT_CHART_DATA = {
  labels: FIXED_SCORES,
  datasets: [{
    data: Array(FIXED_SCORES.length).fill(0),
    backgroundColor: CHART_COLORS[0],
  }]
}

const ChartPage = ({ scores, loggedInUser }) => {
  const { scopeMembers } = useContext(ScopeContext)
  const users = scopeMembers

  const [selectedUser, setSelectedUser] = useState('all')
  const [timePeriod, setTimePeriod] = useState('all-time')
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [chartData, setChartData] = useState(DEFAULT_CHART_DATA)
  const [maxCount, setMaxCount] = useState(0)
  const [availableYears, setAvailableYears] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get group_created_at from scores data
  const groupCreatedAt = useMemo(() => {
    if (scores && scores.length > 0 && scores[0].group_created_at) {
      return scores[0].group_created_at
    }
    return null
  }, [scores])

  // Initialize date range and available years
  useEffect(() => {
    if (!scores?.length || isInitialized) return

    const allDates = scores.flatMap(week => {
      return Object.keys(week.data).filter(date => {
        // Respect group_created_at
        if (groupCreatedAt && date < groupCreatedAt) return false
        return true
      })
    })

    if (allDates.length === 0) {
      setIsInitialized(true)
      return
    }

    const dates = allDates.map(date => new Date(date))
    const years = [...new Set(dates.map(date => date.getFullYear()))]

    setAvailableYears(years.sort((a, b) => b - a))
    setDateRange({
      start: new Date(Math.min(...dates)),
      end: new Date(Math.min(new Date(), Math.max(...dates)))
    })
    setIsInitialized(true)
  }, [scores, isInitialized, groupCreatedAt])

  // Update date range based on time period selection
  useEffect(() => {
    if (!scores?.length || !isInitialized) return

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    let start = dateRange.start
    let end = today

    const getDateFromMonthsAgo = months => {
      const date = new Date(today)
      date.setMonth(today.getMonth() - months)
      return date
    }

    // Get earliest valid date (respecting group_created_at)
    const getEarliestDate = () => {
      const allDates = scores.flatMap(week => {
        return Object.keys(week.data).filter(date => {
          if (groupCreatedAt && date < groupCreatedAt) return false
          return true
        })
      })
      if (allDates.length === 0) return new Date()
      return new Date(Math.min(...allDates.map(d => new Date(d))))
    }

    const timeRanges = {
      'all-time': () => ({ start: getEarliestDate(), end }),
      'last-week': () => {
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 6)
        return { start: startDate, end }
      },
      'last-month': () => ({ start: getDateFromMonthsAgo(1), end }),
      'last-3-months': () => ({ start: getDateFromMonthsAgo(3), end }),
      'last-6-months': () => ({ start: getDateFromMonthsAgo(6), end }),
      'last-year': () => {
        const startDate = new Date(today)
        startDate.setFullYear(today.getFullYear() - 1)
        return { start: startDate, end }
      }
    }

    if (timePeriod.startsWith('year-')) {
      const year = parseInt(timePeriod.split('-')[1])
      start = new Date(year, 0, 1)
      end = new Date(year, 11, 31, 23, 59, 59, 999)

      const nowDate = new Date()
      nowDate.setHours(23, 59, 59, 999)
      if (end > nowDate) {
        end = nowDate
      }
    } else if (timeRanges[timePeriod]) {
      ({ start, end } = timeRanges[timePeriod]())
    }

    // Ensure start is not before group_created_at
    if (groupCreatedAt && start) {
      const groupStart = new Date(groupCreatedAt)
      if (start < groupStart) {
        start = groupStart
      }
    }

    if (start) start.setHours(0, 0, 0, 0)
    setDateRange({ start, end })
  }, [timePeriod, scores, isInitialized, groupCreatedAt])

  // Process score data
  const processData = useMemo(() => {
    if (!scores?.length || !users?.length || !dateRange.start || !dateRange.end) return null

    const usersToProcess = selectedUser === 'all' ? users.map(u => u.username) : [selectedUser]
    const userStats = {}
    let globalMaxCount = 0

    usersToProcess.forEach(username => {
      const scoreCounts = Array(FIXED_SCORES.length).fill(0)
      let totalScore = 0
      let totalEntries = 0

      scores.forEach(week => {
        Object.entries(week.data).forEach(([dateStr, scoreData]) => {
          // Skip dates before group creation
          if (groupCreatedAt && dateStr < groupCreatedAt) return

          const scoreDate = new Date(dateStr)
          if (scoreDate >= dateRange.start && scoreDate <= dateRange.end) {
            const score = scoreData[username] ?? 8
            const index = FIXED_SCORES.indexOf(score)
            if (index > -1) {
              scoreCounts[index]++
              totalScore += score
              totalEntries++
            }
          }
        })
      })

      globalMaxCount = Math.max(globalMaxCount, Math.max(...scoreCounts))
      userStats[username] = {
        scoreCounts,
        average: totalEntries > 0 ? (totalScore / totalEntries).toFixed(2) : '0.00'
      }
    })

    return { userStats, maxCount: Math.ceil(globalMaxCount / 50) * 50 }
  }, [selectedUser, dateRange, scores, users, groupCreatedAt])

  // Update chart data
  useEffect(() => {
    if (!processData) return

    const { userStats, maxCount: newMaxCount } = processData
    setMaxCount(newMaxCount)

    setChartData({
      labels: FIXED_SCORES,
      datasets: Object.entries(userStats).map(([username, { scoreCounts }], index) => ({
        label: username,
        data: scoreCounts,
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      }))
    })
  }, [processData])

  const handleTimePeriodChange = (e) => {
    setIsLoading(true)
    setTimePeriod(e.target.value)
    setTimeout(() => setIsLoading(false), 100)
  }

  if (!users?.length) return null

  return (
    <div id="chartPage" className="page">
      <div className="controls">
        <label>
          Player
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="all">All players</option>
            {users.map(user => (
              <option key={user.id} value={user.username}>{user.forename || user.username}</option>
            ))}
          </select>
        </label>
        <label>
          Time Period
          <select value={timePeriod} onChange={handleTimePeriodChange}>
            <option value="all-time">All-time</option>
            <option value="last-week">Last week</option>
            <option value="last-month">Last month</option>
            <option value="last-3-months">Last 3 months</option>
            <option value="last-6-months">Last 6 months</option>
            <option value="last-year">Last year</option>
            {availableYears.map(year => (
              <option key={year} value={`year-${year}`}>{year}</option>
            ))}
            <option value="custom">Custom dates</option>
          </select>
        </label>
        {timePeriod === 'custom' && (
          <div className="date-picker-container">
            <label>
              Start Date
              <DatePicker
                selected={dateRange.start}
                onChange={date => setDateRange(prev => ({ ...prev, start: date }))}
                minDate={groupCreatedAt ? new Date(groupCreatedAt) : undefined}
                className="date-input"
              />
            </label>
            <label>
              End Date
              <DatePicker
                selected={dateRange.end}
                onChange={date => setDateRange(prev => ({ ...prev, end: date }))}
                maxDate={new Date()}
                className="date-input"
              />
            </label>
          </div>
        )}
      </div>

      <div className="average-score">
        {processData && Object.entries(processData.userStats).map(([username, { average }], index) => {
          const member = scopeMembers.find(m => m.username === username)
          const displayName = member?.forename || username
          return (
            <div key={username} className="player-average">
              <span className="player-name">
                <strong style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}>
                  {displayName}
                </strong>
                <span>'s average score:</span>
              </span>
              <span className="average-value">{average}</span>
            </div>
          )
        })}
      </div>

      <div className="chart">
        <Bar
          data={isLoading ? {
            ...chartData,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              data: dataset.data.map(() => 0)
            }))
          } : chartData}
          options={{
            indexAxis: 'y',
            scales: { x: { max: maxCount } },
            plugins: {
              legend: {
                display: selectedUser === 'all',
                position: 'top'
              },
              datalabels: {
                display: selectedUser !== 'all',
                anchor: 'end',
                align: (context) => {
                  const value = context.dataset.data[context.dataIndex]
                  const threshold = maxCount * 0.85
                  // Inside bar: align left (start), outside: align right (end)
                  return value > threshold ? 'start' : 'end'
                },
                offset: 5,
                color: (context) => {
                  const value = context.dataset.data[context.dataIndex]
                  const threshold = maxCount * 0.85
                  return value > threshold ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)'
                },
                font: {
                  weight: 'bold',
                  size: 12
                },
                formatter: (value) => value === 0 ? '' : value
              }
            },
            animation: {
              duration: 750,
              easing: 'easeInOutQuart'
            },
            transitions: {
              active: { animation: { duration: 750 } }
            }
          }}
        />
      </div>
    </div>
  )
}

export default ChartPage
