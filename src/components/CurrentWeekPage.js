import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React from 'react'
import ScoreTable from './ScoreTable'

const CurrentWeekPage = ({ cwData }) => {
  return (
    <div id="currentWeekPage" className="page">
      <div id="leftArrow" className="arrow">
        <FaArrowLeft />
      </div>
      <ScoreTable cwData={cwData} />
      <div id="leftArrow" className="arrow">
        <FaArrowRight />
      </div>
    </div>
  )
}

export default CurrentWeekPage