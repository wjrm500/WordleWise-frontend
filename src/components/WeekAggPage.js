import React, { useState } from "react"
import WeekScoreTable from "./WeekScoreTable"
import array_chunks from "../utilities/arrays"
import LeftArrow from "./LeftArrow"
import RightArrow from "./RightArrow"

const WeekAggPage = ({data}) => {
  const consolidateWeek = (weekData) => {
    return {
      StartDate: weekData[0].Date,
      KateTotal: weekData.reduce((sum, obj) => sum + obj.Kate, 0),
      WillTotal: weekData.reduce((sum, obj) => sum + obj.Will, 0)
    }
  }
  let weekData = data.map(consolidateWeek)
  weekData = array_chunks(weekData, 7)
  const [weekIndex, setWeekIndex] = useState(weekData.length - 1)
  return (
    <div id="weekAggPage" className="page">
      <LeftArrow active={weekIndex > 0} index={weekIndex} setIndex={setWeekIndex} />
      <WeekScoreTable weekData={weekData} weekIndex={weekIndex} />
      <RightArrow active={weekIndex < weekData.length - 1} index={weekIndex} setIndex={setWeekIndex} />
    </div>
  )
}

export default WeekAggPage