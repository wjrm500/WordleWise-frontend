import React, { useState } from "react"
import DayScoreTable from "./DayScoreTable"
import AddScoreModal from "./AddScoreModal"
import AddScoreOverlay from "./AddScoreOverlay"
import LeftArrow from "./LeftArrow"
import RightArrow from "./RightArrow"

const DayAggPage = ({loggedInUser, addScore, data}) => {
  const [dayIndex, setDayIndex] = useState(data.length - 1)
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)
  const onAddScoreButtonClick = () => {
    setShowAddScoreModal(true)
  }
  return (
    <div id="dayAggPage" className="page">
      {
        showAddScoreModal ? (
          <>
            <AddScoreOverlay />
            <AddScoreModal loggedInUser={loggedInUser} addScore={addScore} setShowAddScoreModal={setShowAddScoreModal} />
          </>
        ) : ""
      }
      <LeftArrow active={dayIndex > 0} index={dayIndex} setIndex={setDayIndex} />
      <DayScoreTable loggedInUser={loggedInUser} dayData={data} dayIndex={dayIndex} onAddScoreButtonClick={onAddScoreButtonClick} />
      <RightArrow active={dayIndex < data.length - 1} index={dayIndex} setIndex={setDayIndex} />
    </div>
  )
}

export default DayAggPage