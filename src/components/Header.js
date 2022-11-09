import LogoutButton from './LogoutButton'
import React from 'react'

const Header = ({ loggedInUser, onLogout }) => {
  return (
    <div id="header">
      <div>Welcome to <b>Wordle Tracker</b></div>
      { loggedInUser ? <LogoutButton onLogout={onLogout} /> : '' }
    </div>
  )
}

export default Header