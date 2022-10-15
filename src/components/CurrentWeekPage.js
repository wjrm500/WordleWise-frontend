import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React from 'react'
import ScoreTable from './ScoreTable'

const CurrentWeekPage = ({ cwData, cwIndex, setCwIndex }) => {
  const leftArrowActive = cwIndex > 0
  const rightArrowActive = cwIndex < cwData.length - 1
  return (
    <div id="currentWeekPage" className="page">
      <div className="arrowContainer">
        <div id="leftArrow" className={leftArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowLeft onClick={() => leftArrowActive ? setCwIndex(cwIndex - 1) : ''} />
        </div>
      </div>
      <ScoreTable cwData={cwData} cwIndex={cwIndex} />
      <div className="arrowContainer">
        <div id="rightArrow" className={rightArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setCwIndex(cwIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default CurrentWeekPage