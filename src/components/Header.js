import LogoutButton from "./LogoutButton"
import React, { useState } from "react"
import UpdateScoreButton from "./UpdateScoreButton"
import UpdateScoreModal from "./UpdateScoreModal"
import ModalOverlay from "./ModalOverlay"
import logo from '../images/logo.png'

const Header = ({loggedInUser, onLogout, addScore, users}) => {
  const [showUpdateScoreModal, setShowUpdateScoreModal] = useState(false)
  const onUpdateScoreButtonClick = () => setShowUpdateScoreModal(true)
  const onModalOverlayClick = () => setShowUpdateScoreModal(false)
  return (
    <div id="header">
      {
        showUpdateScoreModal ? (
          <>
            <ModalOverlay onClick={onModalOverlayClick} />
            <UpdateScoreModal addScore={addScore} setShowUpdateScoreModal={setShowUpdateScoreModal} users={users} />
          </>
        ) : ""
      }
      <img src={logo} alt="WordleWise Logo" style={{ height: "50px" }} />
      <div>Welcome to <b>WordleWise</b></div>
      {loggedInUser && loggedInUser.admin ? <UpdateScoreButton onClick={onUpdateScoreButtonClick} /> : ""}
      {loggedInUser ? <LogoutButton onLogout={onLogout} /> : ""}
    </div>
  )
}

export default Header
