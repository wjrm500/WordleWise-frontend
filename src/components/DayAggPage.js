import React, { useEffect, useState } from "react"
import DayScoreTable from "./DayScoreTable"
import AddScoreModal from "./AddScoreModal"
import ModalOverlay from "./ModalOverlay"
import LeftArrow from "./LeftArrow"
import RightArrow from "./RightArrow"

const DayAggPage = ({loggedInUser, addScore, data, dayIndex, setDayIndex}) => {
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)

  const handleKeyPress = (event) => {
    if (event.keyCode === 37 && dayIndex > 0) { // Left arrow key pressed
      setDayIndex(dayIndex - 1);
    } else if (event.keyCode === 39 && dayIndex < data.length - 1) { // Right arrow key pressed
      setDayIndex(dayIndex + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [dayIndex, data.length, setDayIndex]);

  const onAddScoreButtonClick = () => setShowAddScoreModal(true)
  const onModalOverlayClick = () => setShowAddScoreModal(false)
  return (
    <div id="dayAggPage" className="page">
      {
        showAddScoreModal ? (
          <>
            <ModalOverlay onClick={onModalOverlayClick} />
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