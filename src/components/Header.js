import LogoutButton from "./LogoutButton"
import React from "react"
import UpdateScoreButton from "./UpdateScoreButton"

const Header = ({loggedInUser, onLogout}) => {
  return (
    <div id="header">
      <div>Welcome to <b>Wordle Tracker</b></div>
      {loggedInUser && loggedInUser.admin ? <UpdateScoreButton /> : ""}
      {loggedInUser ? <LogoutButton onLogout={onLogout} /> : ""}
    </div>
  )
}

export default Header