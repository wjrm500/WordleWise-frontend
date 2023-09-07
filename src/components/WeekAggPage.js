import React from "react"
import { calculateTotal } from "../utilities/arrays"
import WeekScoreTable from "./WeekScoreTable"

const WeekAggPage = ({data}) => {

  const consolidateWeek = (weekData) => {
    return {
      StartDate: weekData[0].Date,
      KateTotal: calculateTotal(weekData, "Kate"),
      WillTotal: calculateTotal(weekData, "Will")
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