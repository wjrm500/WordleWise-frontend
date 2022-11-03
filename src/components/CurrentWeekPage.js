import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React, { useState } from 'react'
import ScoreTable from './ScoreTable'
import AddScoreModal from './AddScoreModal'
import AddScoreOverlay from './AddScoreOverlay'
import SpinningLoader from './SpinningLoader'

const CurrentWeekPage = ({ loggedInUser, addScore, data, maxIndex, setMaxIndex }) => {
  const leftArrowActive = maxIndex > 0
  const rightArrowActive = maxIndex < data.length - 1
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
          <FaArrowLeft onClick={() => leftArrowActive ? setMaxIndex(maxIndex - 1) : ''} />
        </div>
      </div>
      {
        maxIndex
        ? <ScoreTable loggedInUser={loggedInUser} data={data} maxIndex={maxIndex} onAddScoreButtonClick={onAddScoreButtonClick} />
        : <SpinningLoader />
      }
      <div className="arrowContainer">
        <div id="rightArrow" className={rightArrowActive ? 'arrow active' : 'arrow'}>
          <FaArrowRight onClick={() => rightArrowActive ? setMaxIndex(maxIndex + 1): ''} />
        </div>
      </div>
    </div>
  )
}

export default CurrentWeekPage