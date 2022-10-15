import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React from 'react'
import ScoreTable from './ScoreTable'

const CurrentWeekPage = ({ cwData, cwIndex, setCwIndex }) => {
  return (
    <div id="currentWeekPage" className="page">
      <div id="leftArrow" className="arrow">
        <FaArrowLeft onClick={() => setCwIndex(cwIndex - 1)} />
      </div>
      <ScoreTable cwData={cwData} cwIndex={cwIndex} />
      <div id="leftArrow" className="arrow">
        <FaArrowRight onClick={() => setCwIndex(cwIndex + 1)} />
      </div>
    </div>
  )
}

export default CurrentWeekPage