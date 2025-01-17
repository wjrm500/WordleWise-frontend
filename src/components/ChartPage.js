import React, { useState, useEffect, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ChartPage = ({ scores, users, loggedInUser }) => {
  const [selectedUser, setSelectedUser] = useState('all')
  const [timePeriod, setTimePeriod] = useState('all-time')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [chartData, setChartData] = useState({
    labels: [1, 2, 3, 4, 5, 6, 8],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(47, 85, 151, 0.8)',
    }],
  })
  const [maxCount, setMaxCount] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [availableYears, setAvailableYears] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (scores && scores.length > 0 && !isInitialized) {
      const allDates = scores.flatMap(week => Object.keys(week.data))
      const years = [...new Set(allDates.map(date => new Date(date).getFullYear()))]
      setAvailableYears(years.sort((a, b) => b - a))

      const initialStartDate = new Date(Math.min(...allDates.map(date => new Date(date))))
      const calculatedEndDate = new Date(Math.max(...allDates.map(date => new Date(date))))
      const today = new Date()
      const initialEndDate = calculatedEndDate > today ? today : calculatedEndDate
      
      setStartDate(initialStartDate)
      setEndDate(initialEndDate)
      setTimeout(() => {
        setIsInitialized(true)
      }, 100)
    }
  }, [scores])

  useEffect(() => {
    if (!scores || scores.length === 0 || !isInitialized) return

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    let newStartDate = startDate
    let newEndDate = today

    switch (timePeriod) {
      case 'all-time':
        const allDates = scores.flatMap(week => Object.keys(week.data))
        newStartDate = new Date(Math.min(...allDates.map(date => new Date(date))))
        break
      case 'last-week':
        newStartDate = new Date(today)
        newStartDate.setDate(today.getDate() - 6)
        break
      case 'last-month':
        newStartDate = new Date(today)
        newStartDate.setMonth(today.getMonth() - 1)
        break
      case 'last-3-months':
        newStartDate = new Date(today)
        newStartDate.setMonth(today.getMonth() - 3)
        break
      case 'last-6-months':
        newStartDate = new Date(today)
        newStartDate.setMonth(today.getMonth() - 6)
        break
      case 'last-year':
        newStartDate = new Date(today)
        newStartDate.setFullYear(today.getFullYear() - 1)
        break
      default:
        if (timePeriod.startsWith('year-')) {
          const year = parseInt(timePeriod.split('-')[1])
          newStartDate = new Date(year, 0, 1)
          newEndDate = new Date(year, 11, 31, 23, 59, 59, 999)
        }
    }

    if (newStartDate) {
      newStartDate.setHours(0, 0, 0, 0)
    }

    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }, [timePeriod, scores, isInitialized])

  const processData = useMemo(() => {
    if (!scores || scores.length === 0 || !users || users.length === 0 || !startDate || !endDate) return null

    const fixedScores = [1, 2, 3, 4, 5, 6, 8]
    let globalMaxCount = 0
    let userDatasets = {}
    let averages = {}

    const usersToProcess = selectedUser === 'all' ? users.map(u => u.username) : [selectedUser]

    usersToProcess.forEach(username => {
      let scoreCounts = Array(fixedScores.length).fill(0)
      let totalScore = 0
      let totalEntries = 0

      scores.forEach(week => {
        Object.entries(week.data).forEach(([dateStr, scoreData]) => {
          const scoreDate = new Date(dateStr)
          if (scoreDate >= startDate && scoreDate <= endDate) {
            const score = scoreData[username] ?? 8
            const index = fixedScores.indexOf(score)
            if (index > -1) {
              scoreCounts[index]++
              totalScore += score
              totalEntries++
            }
          }
        })
      })

      const userMaxCount = Math.max(...scoreCounts)
      if (userMaxCount > globalMaxCount) {
        globalMaxCount = userMaxCount
      }

      userDatasets[username] = scoreCounts
      averages[username] = totalEntries > 0 ? (totalScore / totalEntries).toFixed(2) : '0.00'
    })

    return {
      datasets: userDatasets,
      maxCount: Math.ceil(globalMaxCount / 50) * 50,
      averages
    }
  }, [selectedUser, startDate, endDate, scores, users])

  useEffect(() => {
    if (processData) {
      setMaxCount(processData.maxCount)
      setAverageScore(Object.entries(processData.averages)
        .map(([username, avg]) => `${username}: ${avg}`)
        .join(', '))
      
      const colors = ['rgba(47, 85, 151, 0.8)', 'rgba(192, 0, 0, 0.8)']
      
      setChartData({
        labels: [1, 2, 3, 4, 5, 6, 8],
        datasets: Object.entries(processData.datasets).map(([username, data], index) => ({
          label: username,
          data: data,
          backgroundColor: colors[index % colors.length],
        }))
      })
    }
  }, [processData])

  const handleTimePeriodChange = (e) => {
    setIsLoading(true)
    setTimePeriod(e.target.value)
    setTimeout(() => setIsLoading(false), 100)
  }

  if (!users || !users.length) return null

  return (
    <div id="chartPage" className="page">
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
                selected={startDate}
                onChange={date => setStartDate(date)}
                className="date-input"
              />
            </label>
            <label>
              End Date
              <DatePicker 
                selected={endDate} 
                onChange={date => setEndDate(date)} 
                maxDate={new Date()}
                className="date-input"
              />
            </label>
          </div>
        )}
      </div>
      <div className="average-score">
        {processData && Object.entries(processData.averages).map(([username, avg], index) => (
          <div key={username} className="player-average">
            <span className="player-name">
              <strong style={{ color: index === 0 ? 'rgba(47, 85, 151, 0.8)' : 'rgba(192, 0, 0, 0.8)' }}>
                {username}
              </strong>
              <span>'s average score:</span>
            </span>
            <span className="average-value">{avg}</span>
          </div>
        ))}
      </div>
      <div className="chart">
        <Bar 
          data={isLoading ? {
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              data: dataset.data.map(() => 0)
            }))
          } : chartData} 
          options={{ 
            indexAxis: 'y',
            scales: {
              x: {
                max: maxCount
              }
            },
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
              active: {
                animation: {
                  duration: 750
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default ChartPage
