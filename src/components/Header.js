import LogOutButton from './LogOutButton'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ loggedIn }) => {
  return (
    <div id="header">
        <div>Welcome to <b>Wordle Tracker</b></div>
        { loggedIn ? <LogOutButton /> : '' }
    </div>
  )
}

Header.propTypes = {
    loggedIn: PropTypes.bool.isRequired
}

export default Header