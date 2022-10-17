import LogoutButton from './LogoutButton'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ loggedInUser, onLogout }) => {
  return (
    <div id="header">
        <div>Welcome to <b>Wordle Tracker</b></div>
        { loggedInUser ? <LogoutButton onLogout={onLogout} /> : '' }
    </div>
  )
}

// Header.propTypes = {
//   loggedInUser: PropTypes.string.isRequired
// }

export default Header