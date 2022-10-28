import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React, { useState } from 'react'
import ScoreTable from './ScoreTable'
import AddScoreModal from './AddScoreModal'
import AddScoreOverlay from './AddScoreOverlay'

const CurrentWeekPage = ({ loggedInUser, addScore, cwData, cwIndex, setCwIndex }) => {
  const leftArrowActive = cwIndex > 0
  const rightArrowActive = cwIndex < cwData.length - 1
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)
  const onAddScoreButtonClick = () => {
    setShowAddScoreModal(true)
  }
  return (
    <div id="currentWeekPage" className="page">
      {
        showAddScoreModal ? <AddScoreOverlay /> : ""
      }
      {
        showAddScoreModal ? <AddScoreModal loggedInUser={loggedInUser} addScore={addScore} setShowAddScoreModal={setShowAddScoreModal} /> : ""
      }
      <div className="arrowContainer">
        <div id="leftArrow" className={leftArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowLeft onClick={() => leftArrowActive ? setCwIndex(cwIndex - 1) : ''} />
        </div>
      </div>
      <ScoreTable loggedInUser={loggedInUser} cwData={cwData} cwIndex={cwIndex} onAddScoreButtonClick={onAddScoreButtonClick} />
      <div className="arrowContainer">
        <div id="rightArrow" className={rightArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setCwIndex(cwIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default CurrentWeekPage