import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib } from '@fortawesome/free-solid-svg-icons'

const UpdateScoreButton = () => {
  return (
    <button id="updateScoreButton" className="headerButton">
      <FontAwesomeIcon icon={faPenNib} />
    </button>
  )
}

export default UpdateScoreButton