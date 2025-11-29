import React, { useContext, useState, useEffect, useRef } from 'react';
import ScopeContext from '../../contexts/ScopeContext';
import CreateGroupModal from '../groups/CreateGroupModal';
import JoinGroupModal from '../groups/JoinGroupModal';
import GroupName from '../common/GroupName';
import { FaUser, FaUsers, FaPlus, FaChevronDown, FaStar, FaRegStar } from 'react-icons/fa';

const ScopeSelector = () => {
    const {
        groups,
        currentScope,
        defaultGroupId,
        isPersonalScope,
        selectPersonalScope,
        selectGroupScope,
        setDefaultScope
    } = useContext(ScopeContext);

    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [settingDefault, setSettingDefault] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleLogout = () => {
            setIsOpen(false);
            setShowCreateModal(false);
            setShowJoinModal(false);
        };
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSetDefault = async (type, groupId = null, e) => {
        e.stopPropagation();
        
        const key = type === 'personal' ? 'personal' : groupId;
        setSettingDefault(key);
        
        try {
            await setDefaultScope(type, groupId);
        } finally {
            setSettingDefault(null);
        }
    };

    const isPersonalDefault = defaultGroupId === null;

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isPersonalScope ? <FaUser size={12} /> : <FaUsers size={14} />}
                <span className="dropdown-trigger-text">
                    {isPersonalScope ? 'Personal' : <GroupName group={currentScope?.group} />}
                </span>
                <FaChevronDown size={10} style={{ opacity: 0.7 }} />
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">Scope</div>

                    <div
                        className={`dropdown-item ${isPersonalScope ? 'selected' : ''}`}
                        onClick={() => { selectPersonalScope(); setIsOpen(false); }}
                    >
                        <FaUser size={14} style={{ opacity: 0.6 }} />
                        <span className="dropdown-item-text">Personal</span>
                        <button 
                            className={`default-star-btn ${isPersonalDefault ? 'is-default' : ''} ${settingDefault === 'personal' ? 'is-loading' : ''}`}
                            onClick={(e) => handleSetDefault('personal', null, e)}
                            disabled={settingDefault !== null}
                            title={isPersonalDefault ? 'Default scope' : 'Set as default'}
                        >
                            {isPersonalDefault || settingDefault === 'personal' ? (
                                <FaStar size={12} />
                            ) : (
                                <FaRegStar size={12} />
                            )}
                        </button>
                    </div>

                    {groups.length > 0 && <div className="dropdown-divider" />}

                    {groups.length > 0 && <div className="dropdown-header">Groups</div>}

                    {groups.map(group => {
                        const isDefault = defaultGroupId === group.id;
                        return (
                            <div
                                key={group.id}
                                className={`dropdown-item ${currentScope?.group?.id === group.id ? 'selected' : ''}`}
                                onClick={() => { selectGroupScope(group.id); setIsOpen(false); }}
                            >
                                <FaUsers size={14} style={{ opacity: 0.6 }} />
                                <span className="dropdown-item-text">
                                    <GroupName group={group} />
                                </span>
                                <button 
                                    className={`default-star-btn ${isDefault ? 'is-default' : ''} ${settingDefault === group.id ? 'is-loading' : ''}`}
                                    onClick={(e) => handleSetDefault('group', group.id, e)}
                                    disabled={settingDefault !== null}
                                    title={isDefault ? 'Default scope' : 'Set as default'}
                                >
                                    {isDefault || settingDefault === group.id ? (
                                        <FaStar size={12} />
                                    ) : (
                                        <FaRegStar size={12} />
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    <div className="dropdown-divider" />

                    <div
                        className="dropdown-item dropdown-action"
                        onClick={() => { setShowCreateModal(true); setIsOpen(false); }}
                    >
                        <FaPlus size={12} />
                        Create Group
                    </div>
                    <div
                        className="dropdown-item dropdown-action"
                        onClick={() => { setShowJoinModal(true); setIsOpen(false); }}
                    >
                        <FaPlus size={12} />
                        Join Group
                    </div>
                </div>
            )}

            {showCreateModal && (
                <CreateGroupModal onClose={() => setShowCreateModal(false)} />
            )}
            {showJoinModal && (
                <JoinGroupModal onClose={() => setShowJoinModal(false)} />
            )}
        </div>
    );
};

export default ScopeSelector;
