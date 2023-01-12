import LogoutButton from "./LogoutButton"
import React, { useState } from "react"
import UpdateScoreButton from "./UpdateScoreButton"
import UpdateScoreModal from "./UpdateScoreModal"
import ModalOverlay from "./ModalOverlay"

const Header = ({loggedInUser, onLogout, addScore}) => {
  const [showUpdateScoreModal, setShowUpdateScoreModal] = useState(false)
  const onUpdateScoreButtonClick = () => setShowUpdateScoreModal(true)
  const onModalOverlayClick = () => setShowUpdateScoreModal(false)
  return (
    <div id="header">
      {
        showUpdateScoreModal ? (
          <>
            <ModalOverlay onClick={onModalOverlayClick} />
            <UpdateScoreModal addScore={addScore} setShowUpdateScoreModal={setShowUpdateScoreModal} />
          </>
        ) : ""
      }
      <div>Welcome to <b>Wordle Tracker</b></div>
      {loggedInUser && loggedInUser.admin ? <UpdateScoreButton onClick={onUpdateScoreButtonClick} /> : ""}
      {loggedInUser ? <LogoutButton onLogout={onLogout} /> : ""}
    </div>
  )
}

export default Header