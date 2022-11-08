import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React, { useState } from 'react'
import DayScoreTable from './DayScoreTable'
import AddScoreModal from './AddScoreModal'
import AddScoreOverlay from './AddScoreOverlay'
import SpinningLoader from './SpinningLoader'

const DayAggPage = ({ loggedInUser, addScore, dayData, dayMaxIndex, setDayMaxIndex }) => {
  const leftArrowActive = dayMaxIndex > 0
  const rightArrowActive = dayMaxIndex < dayData.length - 1
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
        <div className={leftArrowActive ? 'leftArrow arrow active' : 'leftArrow arrow'}>
          <FaArrowLeft onClick={() => leftArrowActive ? setDayMaxIndex(dayMaxIndex - 1) : ''} />
        </div>
      </div>
      {
        dayMaxIndex >= 0
        ? <DayScoreTable loggedInUser={loggedInUser} dayData={dayData} dayMaxIndex={dayMaxIndex} onAddScoreButtonClick={onAddScoreButtonClick} />
        : <SpinningLoader />
      }
      <div className="arrowContainer">
        <div className={rightArrowActive ? 'rightArrow arrow active' : 'rightArrow arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setDayMaxIndex(dayMaxIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default DayAggPage