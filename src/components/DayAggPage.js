import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import React, { useState } from "react"
import DayScoreTable from "./DayScoreTable"
import AddScoreModal from "./AddScoreModal"
import AddScoreOverlay from "./AddScoreOverlay"

const DayAggPage = ({ loggedInUser, addScore, data }) => {
  const [dayIndex, setDayIndex] = useState(data.length - 1)
  const leftArrowActive = dayIndex > 0
  const rightArrowActive = dayIndex < data.length - 1
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)
  const onAddScoreButtonClick = () => {
    setShowAddScoreModal(true)
  }
  return (
    <div id="dayAggPage" className="page">
      {
        showAddScoreModal ? <AddScoreOverlay /> : ""
      }
      {
        showAddScoreModal ? <AddScoreModal loggedInUser={loggedInUser} addScore={addScore} setShowAddScoreModal={setShowAddScoreModal} /> : ""
      }
      <div className="arrowContainer">
        <div className={leftArrowActive ? "leftArrow arrow active" : "leftArrow arrow"}>
          <FaArrowLeft onClick={() => leftArrowActive ? setDayIndex(dayIndex - 1) : ""} />
        </div>
      </div>
      <DayScoreTable loggedInUser={loggedInUser} dayData={data} dayIndex={dayIndex} onAddScoreButtonClick={onAddScoreButtonClick} />
      <div className="arrowContainer">
        <div className={rightArrowActive ? "rightArrow arrow active" : "rightArrow arrow"}>
          <FaArrowRight onClick={() => rightArrowActive ? setDayIndex(dayIndex + 1): ""} />
        </div>
      </div>
    </div>
  )
}

export default DayAggPage