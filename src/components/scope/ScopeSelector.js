import React, { useContext, useState, useEffect, useRef } from 'react';
import ScopeContext from '../../contexts/ScopeContext';
import CreateGroupModal from '../groups/CreateGroupModal';
import JoinGroupModal from '../groups/JoinGroupModal';
import { FaUser, FaUsers, FaPlus, FaChevronDown } from 'react-icons/fa';

const ScopeSelector = () => {
    const {
        groups,
        currentScope,
        isPersonalScope,
        selectPersonalScope,
        selectGroupScope
    } = useContext(ScopeContext);

    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const dropdownRef = useRef(null);

    const currentLabel = isPersonalScope
        ? 'Personal'
        : currentScope?.group?.name || 'Select...';

    // Click outside handler
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

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isPersonalScope ? <FaUser size={12} /> : <FaUsers size={14} />}
                <span>{currentLabel}</span>
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
                        Personal
                    </div>

                    {groups.length > 0 && <div className="dropdown-divider" />}

                    {groups.length > 0 && <div className="dropdown-header">Groups</div>}

                    {groups.map(group => (
                        <div
                            key={group.id}
                            className={`dropdown-item ${currentScope?.group?.id === group.id ? 'selected' : ''}`}
                            onClick={() => { selectGroupScope(group.id); setIsOpen(false); }}
                        >
                            <FaUsers size={14} style={{ opacity: 0.6 }} />
                            {group.name}
                        </div>
                    ))}

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
