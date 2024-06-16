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
      label: 'Number of Scores',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  })

  useEffect(() => {
    if (!scores || scores.length === 0) return
    if (!users || users.length === 0) return

    const fetchData = () => {
      // Flatten scores and map to objects containing both score and date
      const userScores = scores.flatMap(week => 
        Object.entries(week.data).map(([date, scores]) => ({
          date,
          score: scores[selectedUser] || 8,
        }))
      )

      const filteredScores = userScores.filter(({ date }) => {
        const scoreDate = new Date(date)
        return (!startDate || scoreDate >= startDate) && (!endDate || scoreDate <= endDate)
      }).map(({ score }) => score) // Get only scores for further processing

      const scoreCounts = filteredScores.reduce((acc, score) => {
        acc[score] = (acc[score] || 0) + 1
        return acc
      }, {})

      const labels = Object.keys(scoreCounts).sort((a, b) => a - b)
      const data = labels.map(label => scoreCounts[label])

      setChartData({
        labels,
        datasets: [{
          label: 'Number of Scores',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
        <Bar data={chartData} options={{ indexAxis: 'y' }} />
      </div>
    </div>
  )
}

export default StatsPage