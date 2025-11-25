import React from "react"
import WeekScoreTable from "./WeekScoreTable"

const WeekAggPage = ({ data, onWeekRowClick }) => {
  // Add index to each week for navigation
  const weekDataWithIndex = data.map((weekData, index) => ({
    ...weekData,
    index
  }))

  // Reverse to show most recent first
  const reversedData = [...weekDataWithIndex].reverse()

  return (
    <div id="weekAggPage" className="page">
      <WeekScoreTable weekData={reversedData} onWeekRowClick={onWeekRowClick} />
    </div>
  )
}

export default WeekAggPage