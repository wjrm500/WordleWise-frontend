import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React from 'react'
import WeekScoreTable from './WeekScoreTable'
import SpinningLoader from './SpinningLoader'

const WeekAggPage = ({ weekData, weekMaxIndex, setWeekMaxIndex }) => {
  const leftArrowActive = weekMaxIndex > 0
  const rightArrowActive = weekMaxIndex < weekData.length - 1
  return (
    <div id="weekAggPage" className="page">
      <div className="arrowContainer">
        <div className={leftArrowActive ? 'leftArrow arrow active' : 'leftArrow arrow'}>
          <FaArrowLeft onClick={() => leftArrowActive ? setWeekMaxIndex(weekMaxIndex - 1) : ''} />
        </div>
      </div>
      {
        weekMaxIndex >= 0
        ? <WeekScoreTable weekData={weekData} weekMaxIndex={weekMaxIndex} />
        : <SpinningLoader />
      }
      <div className="arrowContainer">
        <div className={rightArrowActive ? 'rightArrow arrow active' : 'rightArrow arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setWeekMaxIndex(weekMaxIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default WeekAggPage