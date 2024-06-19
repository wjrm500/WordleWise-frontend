import React, { useState, useEffect, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const StatsPage = ({ scores, users, loggedInUser }) => {
  const [selectedUser, setSelectedUser] = useState(loggedInUser.username)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [chartData, setChartData] = useState({
    labels: [1, 2, 3, 4, 5, 6, 8],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  })
  const [maxCount, setMaxCount] = useState(0)

  // Calculate initial start and end dates
  useEffect(() => {
    if (scores && scores.length > 0) {
      const allDates = scores.flatMap(week => Object.keys(week.data))
      const initialStartDate = new Date(Math.min(...allDates.map(date => new Date(date))))
      const calculatedEndDate = new Date(Math.max(...allDates.map(date => new Date(date))))
      const today = new Date()
      const initialEndDate = calculatedEndDate > today ? today : calculatedEndDate
      setStartDate(initialStartDate)
      setEndDate(initialEndDate)
    }
  }, [scores])

  const processData = useMemo(() => {
    if (!scores || scores.length === 0 || !users || users.length === 0) return null

    const fixedScores = [1, 2, 3, 4, 5, 6, 8]
    let globalMaxCount = 0
    let scoreCounts = Array(fixedScores.length).fill(0)

    users.forEach(user => {
      const userScoreCounts = Array(fixedScores.length).fill(0)

      scores.forEach(week => {
        Object.entries(week.data).forEach(([date, scoreData]) => {
          const scoreDate = new Date(date)
          if ((!startDate || scoreDate >= startDate) && (!endDate || scoreDate <= endDate)) {
            const score = scoreData[user.username] || 8
            const index = fixedScores.indexOf(score)
            if (index > -1) {
              userScoreCounts[index]++
            }
          }
        })
      })

      const userMaxCount = Math.max(...userScoreCounts)
      if (userMaxCount > globalMaxCount) {
        globalMaxCount = userMaxCount
      }

      if (user.username === selectedUser) {
        scoreCounts = userScoreCounts
      }
    })

    setMaxCount(Math.ceil(globalMaxCount / 50) * 50)
    return scoreCounts
  }, [selectedUser, startDate, endDate, scores, users])

  useEffect(() => {
    if (processData) {
      setChartData({
        labels: [1, 2, 3, 4, 5, 6, 8],
        datasets: [{
          data: processData,
          backgroundColor: 'rgba(47, 85, 151, 0.8)',
        }],
      })
    }
  }, [processData])

  if (!users || !users.length) return null

  const userOptions = users.map(user => (
    <option key={user.id} value={user.username}>{user.username}</option>
  ))

  return (
    <div id="statsPage" className="page">
      <div className="controls">
        <label>
          Player
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            {userOptions}
          </select>
        </label>
        <label>
          Start Date
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </label>
        <label>
          End Date
          <DatePicker 
            selected={endDate} 
            onChange={date => setEndDate(date)} 
            maxDate={new Date()} // Set today's date as the maximum selectable date
          />
        </label>
      </div>
      <div className="chart">
        <Bar 
          data={chartData} 
          options={{ 
            indexAxis: 'y',
            scales: {
              x: {
                max: maxCount
              }
            },
            plugins: {
              legend: {
                display: false,
              }
            }
          }} 
        />
      </div>
    </div>
  )
}

export default StatsPage
