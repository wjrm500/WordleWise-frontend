import React, { useState, useContext } from "react"
import { FaPlus, FaGamepad, FaCog, FaSignOutAlt } from 'react-icons/fa'
import PlayWordleModal from "./PlayWordleModal"
import AddScoreModal from "./AddScoreModal"
import AdminUpdateScoreModal from "./AdminUpdateScoreModal"
import ModalOverlay from "./ModalOverlay"
import ScopeContext from "../contexts/ScopeContext"
import ScopeSelector from "./scope/ScopeSelector"
import GroupSettingsModal from "./groups/GroupSettingsModal"
import logo from '../images/logo.png'

const Header = ({ loggedInUser, onLogout }) => {
  const [showPlayWordleModal, setShowPlayWordleModal] = useState(false)
  const [showAddScoreModal, setShowAddScoreModal] = useState(false)
  const [showAdminUpdateScoreModal, setShowAdminUpdateScoreModal] = useState(false)
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  const { isGroupScope, currentScope } = useContext(ScopeContext)

  const closeAllModals = () => {
    setShowPlayWordleModal(false)
    setShowAddScoreModal(false)
    setShowAdminUpdateScoreModal(false)
    setShowGroupSettingsModal(false)
    setShowSettingsMenu(false)
  }

  // Only check admin status if logged in
  const isSiteAdmin = loggedInUser ? loggedInUser.admin === 1 : false

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
      {showAdminUpdateScoreModal && (
        <>
          <ModalOverlay onClick={closeAllModals} />
          <AdminUpdateScoreModal onClose={() => setShowAdminUpdateScoreModal(false)} />
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
            {(isGroupScope || isSiteAdmin) && (
              <div style={{ position: 'relative' }}>
                <button
                  className="headerButton"
                  onClick={() => {
                    if (isGroupScope) {
                      setShowGroupSettingsModal(true);
                    } else {
                      setShowSettingsMenu(!showSettingsMenu);
                    }
                  }}
                  title={isGroupScope ? "Group Settings" : "Settings"}
                >
                  <FaCog className="icon-20px" />
                </button>

                {/* Only show dropdown menu for site admins when not in group scope */}
                {showSettingsMenu && isSiteAdmin && !isGroupScope && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 5px)',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      zIndex: 1000,
                      overflow: 'hidden',
                      color: 'black'
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => { setShowAdminUpdateScoreModal(true); setShowSettingsMenu(false); }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Update Any Score
                    </div>
                  </div>
                )}
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