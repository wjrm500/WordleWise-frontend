import React from "react"
import { calculateTotal } from "../utilities/arrays"
import { beautifyDate } from "../utilities/dates"
import WeekScoreTable from "./WeekScoreTable"

const WeekAggPage = ({data, onWeekRowClick}) => {
  const consolidateWeek = (weekData, index) => {
    return {
      index,
      StartOfWeek: beautifyDate(weekData.start_of_week, false, true),
      KateTotal: calculateTotal(weekData["data"], "kjem500"),
      WillTotal: calculateTotal(weekData["data"], "wjrm500")
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