import React from "react"

const LogoutButton = ({onLogout}) => {
  return (
    <button id="logoutButton" className="headerButton" onClick={onLogout}>
      Log out
    </button>
  )
}

export default LogoutButton