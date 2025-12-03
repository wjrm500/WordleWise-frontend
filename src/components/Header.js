import React, { useState, useContext, useEffect } from "react"
import { FaPlus, FaGamepad, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import PlayWordleModal from "./PlayWordleModal"
import AddScoreModal from "./AddScoreModal"
import ModalOverlay from "./ModalOverlay"
import ScopeContext from "../contexts/ScopeContext"
import ScopeSelector from "./scope/ScopeSelector"
import GroupSettingsModal from "./groups/GroupSettingsModal"
import logo from '../images/logo.png'

const Header = ({ loggedInUser, onLogout }) => {
  const [showPlayWordleModal, setShowPlayWordleModal] = useState(false)
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { isGroupScope, currentScope } = useContext(ScopeContext)

  // Close all modals on auth logout
  useEffect(() => {
    const handleLogout = () => {
      setShowPlayWordleModal(false)
      setShowAddScoreModal(false)
      setShowGroupSettingsModal(false)
      setMobileMenuOpen(false)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 480) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeAllModals = () => {
    setShowPlayWordleModal(false)
    setShowAddScoreModal(false)
    setShowGroupSettingsModal(false)
  }

  const handleButtonClick = (action) => {
    setMobileMenuOpen(false)
    action()
  }

  const renderButtons = (isMobile = false) => (
    <>
      <button 
        className="headerButton" 
        onClick={() => handleButtonClick(() => setShowAddScoreModal(true))} 
        title="Add score"
      >
        <FaPlus className="icon-20px" />
        {isMobile && <span className="header-button-label">Add score</span>}
      </button>

      <button 
        className="headerButton" 
        onClick={() => handleButtonClick(() => setShowPlayWordleModal(true))} 
        title="Play Wordle"
      >
        <FaGamepad className="icon-20px" />
        {isMobile && <span className="header-button-label">Play Wordle</span>}
      </button>

      {isGroupScope && (
        <button
          className="headerButton"
          onClick={() => handleButtonClick(() => setShowGroupSettingsModal(true))}
          title="Group settings"
        >
          <FaCog className="icon-20px" />
          {isMobile && <span className="header-button-label">Group settings</span>}
        </button>
      )}

      <button 
        className="headerButton" 
        onClick={() => handleButtonClick(onLogout)} 
        title="Logout"
      >
        <FaSignOutAlt className="icon-20px" />
        {isMobile && <span className="header-button-label">Logout</span>}
      </button>
    </>
  )

  return (
    <div id="header">
      {showPlayWordleModal && (
        <>
          <ModalOverlay onClick={closeAllModals} />
          <PlayWordleModal setShowPlayWordleModal={setShowPlayWordleModal} />
        </>
      )}
      {showAddScoreModal && (
        <>
          <ModalOverlay onClick={closeAllModals} />
          <AddScoreModal onClose={() => setShowAddScoreModal(false)} />
        </>
      )}
      {showGroupSettingsModal && isGroupScope && currentScope?.group && (
        <>
          <ModalOverlay onClick={closeAllModals} />
          <GroupSettingsModal group={currentScope.group} onClose={() => setShowGroupSettingsModal(false)} />
        </>
      )}

      <div className="header-main">
        <div className="header-left">
          <img src={logo} alt="WordleWise Logo" />
          {loggedInUser && <ScopeSelector />}
        </div>

        {loggedInUser && (
          <div className="header-right">
            <div className="header-buttons">
              {renderButtons(false)}
            </div>

            <button 
              className="burger-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes className="icon-20px" /> : <FaBars className="icon-20px" />}
            </button>
          </div>
        )}
      </div>

      {loggedInUser && (
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {renderButtons(true)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header;