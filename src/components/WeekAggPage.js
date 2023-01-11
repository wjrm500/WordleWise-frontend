import React from "react"
import WeekScoreTable from "./WeekScoreTable"

const WeekAggPage = ({data}) => {
  const consolidateWeek = (weekData) => {
    return {
      StartDate: weekData[0].Date,
      KateTotal: weekData.reduce((sum, obj) => sum + obj.Kate, 0),
      WillTotal: weekData.reduce((sum, obj) => sum + obj.Will, 0)
    }
  }
  let weekData = data.map(consolidateWeek)
  weekData.reverse()
  return (
    <div id="weekAggPage" className="page">
      <WeekScoreTable weekData={weekData} />
    </div>
  )
}

export default WeekAggPage