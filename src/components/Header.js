import React, { useState, useContext } from "react"
import { FaPlus, FaGamepad, FaCog, FaSignOutAlt } from 'react-icons/fa'
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

  const { isGroupScope, currentScope } = useContext(ScopeContext)

  const closeAllModals = () => {
    setShowPlayWordleModal(false)
    setShowAddScoreModal(false)
    setShowGroupSettingsModal(false)
  }

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

      <div className="header-left">
        <img src={logo} alt="WordleWise Logo" style={{ height: "50px" }} />
        {loggedInUser && <ScopeSelector />}
      </div>

      <div className="header-buttons">
        {loggedInUser && (
          <>
            <button className="headerButton" onClick={() => setShowAddScoreModal(true)} title="Add Score">
              <FaPlus className="icon-20px" />
            </button>

            <button className="headerButton" onClick={() => setShowPlayWordleModal(true)} title="Play past Wordle">
              <FaGamepad className="icon-20px" />
            </button>

            {/* Settings button - opens group settings directly in group scope */}
            {isGroupScope && (
              <div style={{ position: 'relative' }}>
                <button
                  className="headerButton"
                  onClick={() => {
                    setShowGroupSettingsModal(true);
                  }}
                  title="Group Settings"
                >
                  <FaCog className="icon-20px" />
                </button>
              </div>
            )}

            <button className="headerButton" onClick={onLogout} title="Logout">
              <FaSignOutAlt className="icon-20px" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header