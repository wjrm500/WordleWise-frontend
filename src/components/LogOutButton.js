import React from 'react'

const LogoutButton = ({ onLogout }) => {
  return (
    <button id="logoutButton" onClick={onLogout}>
        Log out
    </button>
  )
}

export default LogoutButton