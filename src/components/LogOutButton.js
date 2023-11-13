import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const LogoutButton = ({onLogout}) => {
  return (
    <button id="logoutButton" className="headerButton" onClick={onLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
  )
}

export default LogoutButton