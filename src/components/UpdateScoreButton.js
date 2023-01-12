import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib } from '@fortawesome/free-solid-svg-icons'

const UpdateScoreButton = ({onClick}) => {
  return (
    <button id="updateScoreButton" className="headerButton" onClick={onClick}>
      <FontAwesomeIcon icon={faPenNib} />
    </button>
  )
}

export default UpdateScoreButton