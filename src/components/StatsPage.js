import React, { useState, useEffect } from 'react'
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
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  })
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    if (!scores || scores.length === 0) return
    if (!users || users.length === 0) return

    let globalMaxCount = 0

    // Find the global maximum score count
    users.forEach(user => {
      const userScores = scores.flatMap(week => 
        Object.entries(week.data).map(([date, scores]) => ({
          date,
          score: scores[user.username] || 8,
        }))
      )

      const filteredScores = userScores.filter(({ date }) => {
        const scoreDate = new Date(date)
        return (!startDate || scoreDate >= startDate) && (!endDate || scoreDate <= endDate)
      }).map(({ score }) => score)

      const scoreCounts = filteredScores.reduce((acc, score) => {
        acc[score] = (acc[score] || 0) + 1
        return acc
      }, {})

      const maxCount = Math.max(...Object.values(scoreCounts))
      if (maxCount > globalMaxCount) {
        globalMaxCount = maxCount
      }
    })

    setMaxCount(Math.ceil(globalMaxCount / 50) * 50)
  }, [startDate, endDate, scores, users])

  useEffect(() => {
    if (!scores || scores.length === 0) return
    if (!users || users.length === 0) return

    const fetchData = () => {
      const fixedScores = [1, 2, 3, 4, 5, 6, 8]

      const userScores = scores.flatMap(week => 
        Object.entries(week.data).map(([date, scores]) => ({
          date,
          score: scores[selectedUser] || 8,
        }))
      )

      const filteredScores = userScores.filter(({ date }) => {
        const scoreDate = new Date(date)
        return (!startDate || scoreDate >= startDate) && (!endDate || scoreDate <= endDate)
      }).map(({ score }) => score)

      const scoreCounts = filteredScores.reduce((acc, score) => {
        acc[score] = (acc[score] || 0) + 1
        return acc
      }, {})

      fixedScores.forEach(score => {
        if (!scoreCounts[score]) {
          scoreCounts[score] = 0
        }
      })

      const labels = fixedScores
      const data = labels.map(label => scoreCounts[label])

      setChartData({
        labels,
        datasets: [{
          data,
          backgroundColor: 'rgba(47, 85, 151, 0.8)',
        }],
      })
    }

    fetchData()
  }, [selectedUser, startDate, endDate, scores, users])

  if (!users || !users.length) return null // Render nothing if users array is empty

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
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
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