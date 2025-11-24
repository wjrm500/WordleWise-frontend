import LogoutButton from "./LogOutButton"
import React, { useState, useEffect, useContext } from "react"
import UpdateScoreButton from "./UpdateScoreButton"
import UpdateScoreModal from "./UpdateScoreModal"
import PlayWordleButton from "./PlayWordleButton"
import PlayWordleModal from "./PlayWordleModal"
import ModalOverlay from "./ModalOverlay"
import ServerAddrContext from "../contexts/ServerAddrContext"
import logo from '../images/logo.png'

const Header = ({loggedInUser, onLogout, addScore, users}) => {
  const [showUpdateScoreModal, setShowUpdateScoreModal] = useState(false)
  const [showPlayWordleModal, setShowPlayWordleModal] = useState(false)
  const [title, setTitle] = useState(null)
  const SERVER_ADDR = useContext(ServerAddrContext)
  
  useEffect(() => {
    const fetchTitle = () => {
      fetch(`${SERVER_ADDR}/getTitle`)
        .then(r => r.json())
        .then(data => setTitle(data.title))
        .catch(() => {})
    }
    fetchTitle()
    const interval = setInterval(fetchTitle, 60000)
    return () => clearInterval(interval)
  }, [SERVER_ADDR])
  
  const onUpdateScoreButtonClick = () => setShowUpdateScoreModal(true)
  const onPlayWordleButtonClick = () => setShowPlayWordleModal(true)
  const onModalOverlayClick = () => {
    setShowUpdateScoreModal(false)
    setShowPlayWordleModal(false)
  }
  
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
      {
        showPlayWordleModal ? (
          <>
            <ModalOverlay onClick={onModalOverlayClick} />
            <PlayWordleModal setShowPlayWordleModal={setShowPlayWordleModal} />
          </>
        ) : ""
      }
      <img src={logo} alt="WordleWise Logo" style={{ height: "50px" }} />
      <div>{title ? (title === 'Welcome to WordleWise' ? <>Welcome to <b>WordleWise</b></> : title) : ''}</div>
      <div style={{ display: 'flex' }}>
        {loggedInUser ? <PlayWordleButton onClick={onPlayWordleButtonClick} /> : ""}
        {loggedInUser && loggedInUser.admin ? <UpdateScoreButton onClick={onUpdateScoreButtonClick} /> : ""}
        {loggedInUser ? <LogoutButton onLogout={onLogout} /> : ""}
      </div>
    </div>
  )
}

export default Header
