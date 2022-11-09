import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import React, { useState } from "react"
import WeekScoreTable from "./WeekScoreTable"
import SpinningLoader from "./SpinningLoader"
import array_chunks from "../utilities/arrays"

const WeekAggPage = ({ data }) => {
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
  const leftArrowActive = weekIndex > 0
  const rightArrowActive = weekIndex < weekData.length - 1
  return (
    <div id="weekAggPage" className="page">
      <div className="arrowContainer">
        <div className={leftArrowActive ? "leftArrow arrow active" : "leftArrow arrow"}>
          <FaArrowLeft onClick={() => leftArrowActive ? setWeekIndex(weekIndex - 1) : ""} />
        </div>
      </div>
      {
        weekIndex >= 0
        ? <WeekScoreTable weekData={weekData} weekIndex={weekIndex} />
        : <SpinningLoader />
      }
      <div className="arrowContainer">
        <div className={rightArrowActive ? "rightArrow arrow active" : "rightArrow arrow"}>
          <FaArrowRight onClick={() => rightArrowActive ? setWeekIndex(weekIndex + 1): ""} />
        </div>
      </div>
    </div>
  )
}

export default WeekAggPage