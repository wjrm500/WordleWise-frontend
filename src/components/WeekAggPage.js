import React from "react"
import { calculateTotal } from "../utilities/arrays"
import WeekScoreTable from "./WeekScoreTable"

const WeekAggPage = ({data, onWeekRowClick}) => {

  const consolidateWeek = (weekData, index) => {
    return {
      index,
      StartDate: weekData[0].Date,
      KateTotal: calculateTotal(weekData, "Kate"),
      WillTotal: calculateTotal(weekData, "Will")
    }
  }
  let weekData = data.map((weekData, index) => consolidateWeek(weekData, index))
  weekData.reverse()
  return (
    <div id="weekAggPage" className="page">
      <WeekScoreTable weekData={weekData} onWeekRowClick={onWeekRowClick} />
    </div>
  )
}

export default WeekAggPage