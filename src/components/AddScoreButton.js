import React from "react"

const AddScoreButton = ({ onAddScoreButtonClick }) => {
  return (
    <button className="addScoreButton" onClick={onAddScoreButtonClick}>
      Add
    </button>
  )
}

export default AddScoreButton