import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React from 'react'
import ScoreTable from './ScoreTable'
import AddScoreModal from './AddScoreModal'
import AddScoreOverlay from './AddScoreOverlay'

const CurrentWeekPage = ({ loggedInUser, cwData, cwIndex, setCwIndex }) => {
  const leftArrowActive = cwIndex > 0
  const rightArrowActive = cwIndex < cwData.length - 1
  return (
    <div id="currentWeekPage" className="page">
      <AddScoreOverlay></AddScoreOverlay>
      <AddScoreModal></AddScoreModal> 
      <div className="arrowContainer">
        <div id="leftArrow" className={leftArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowLeft onClick={() => leftArrowActive ? setCwIndex(cwIndex - 1) : ''} />
        </div>
      </div>
      <ScoreTable loggedInUser={loggedInUser} cwData={cwData} cwIndex={cwIndex} />
      <div className="arrowContainer">
        <div id="rightArrow" className={rightArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setCwIndex(cwIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default CurrentWeekPage