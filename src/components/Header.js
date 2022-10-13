import LogoutButton from './LogoutButton'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ loggedIn, onLogout }) => {
  return (
    <div id="header">
        <div>Welcome to <b>Wordle Tracker</b></div>
        { loggedIn ? <LogoutButton onLogout={onLogout} /> : '' }
    </div>
  )
}

Header.propTypes = {
    loggedIn: PropTypes.bool.isRequired
}

export default Header