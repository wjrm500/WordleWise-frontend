import React, { useState, useEffect, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Constants
const CHART_COLORS = ['rgba(47, 85, 151, 0.8)', 'rgba(192, 0, 0, 0.8)']
const FIXED_SCORES = [1, 2, 3, 4, 5, 6, 8]
const DEFAULT_CHART_DATA = {
  labels: FIXED_SCORES,
  datasets: [{
    data: Array(FIXED_SCORES.length).fill(0),
    backgroundColor: CHART_COLORS[0],
  }]
}

const ChartPage = ({ scores, users, loggedInUser }) => {
  // State
  const [selectedUser, setSelectedUser] = useState('all')
  const [timePeriod, setTimePeriod] = useState('all-time')
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [chartData, setChartData] = useState(DEFAULT_CHART_DATA)
  const [maxCount, setMaxCount] = useState(0)
  const [availableYears, setAvailableYears] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize date range and available years
  useEffect(() => {
    if (!scores?.length || isInitialized) return

    const allDates = scores.flatMap(week => Object.keys(week.data))
    const dates = allDates.map(date => new Date(date))
    const years = [...new Set(dates.map(date => date.getFullYear()))]
    
    setAvailableYears(years.sort((a, b) => b - a))
    setDateRange({
      start: new Date(Math.min(...dates)),
      end: new Date(Math.min(new Date(), Math.max(...dates)))
    })
    setIsInitialized(true)
  }, [scores, isInitialized])

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

    const timeRanges = {
      'all-time': () => ({ 
        start: new Date(Math.min(...scores.flatMap(week => Object.keys(week.data)).map(date => new Date(date)))),
        end
      }),
      'last-week': () => {
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 6)
        return { start: startDate, end }
      },
      'last-month': () => ({ start: getDateFromMonthsAgo(1), end }),
      'last-3-months': () => ({ start: getDateFromMonthsAgo(3), end }),
      'last-6-months': () => ({ start: getDateFromMonthsAgo(6), end }),
      'last-year': () => ({ 
        start: new Date(today.setFullYear(today.getFullYear() - 1)),
        end
      })
    }

    if (timePeriod.startsWith('year-')) {
      const year = parseInt(timePeriod.split('-')[1])
      start = new Date(year, 0, 1)
      end = new Date(year, 11, 31, 23, 59, 59, 999)
    } else if (timeRanges[timePeriod]) {
      ({ start, end } = timeRanges[timePeriod]())
    }

    if (start) start.setHours(0, 0, 0, 0)
    setDateRange({ start, end })
  }, [timePeriod, scores, isInitialized])

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
  }, [selectedUser, dateRange, scores, users])

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
      {/* Controls */}
      <div className="controls">
        <label>
          Player
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="all">All players</option>
            {users.map(user => (
              <option key={user.id} value={user.username}>{user.username}</option>
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

      {/* Average Scores */}
      <div className="average-score">
        {processData && Object.entries(processData.userStats).map(([username, { average }], index) => (
          <div key={username} className="player-average">
            <span className="player-name">
              <strong style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}>
                {username}
              </strong>
              <span>'s average score:</span>
            </span>
            <span className="average-value">{average}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
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
