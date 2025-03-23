import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad } from '@fortawesome/free-solid-svg-icons'

const PlayWordleButton = ({onClick}) => {
  return (
    <button id="playWordleButton" className="headerButton" onClick={onClick} title="Play past Wordle">
      <FontAwesomeIcon icon={faGamepad} className="icon-20px" />
    </button>
  )
}

export default PlayWordleButton