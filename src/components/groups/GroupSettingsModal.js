import React, { useState, useEffect, useContext } from 'react';
import api from '../../utilities/api';
import ScopeContext from '../../contexts/ScopeContext';
import ErrorMessage from '../common/ErrorMessage';
import GroupName from '../common/GroupName';
import InviteCodeDisplay from './InviteCodeDisplay';
import MemberList from './MemberList';

const GroupSettingsModal = ({ group: initialGroup, onClose }) => {
    const [group, setGroup] = useState(initialGroup);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [error, setError] = useState(null);

    const { refreshGroups, refreshScores, selectGroupScope, selectPersonalScope, currentGroupRole } = useContext(ScopeContext);
    const isAdmin = currentGroupRole === 'admin';

    useEffect(() => {
        fetchDetails();
    }, [initialGroup.id]);

    const fetchDetails = async () => {
        setError(null);
        try {
            const response = await api.get(`/groups/${initialGroup.id}`);
            setGroup(response.data);
            setMembers(response.data.members);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch group details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!window.confirm('Are you sure you want to leave this group?')) return;

        setError(null);
        try {
            await api.post(`/groups/${group.id}/leave`);
            await refreshGroups();
            selectPersonalScope();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to leave group");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure? This will delete the group for everyone. This cannot be undone.')) return;

        setError(null);
        try {
            await api.delete(`/groups/${group.id}`);
            await refreshGroups();
            selectPersonalScope();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete group");
        }
    };

    const handleUpdateGroup = async (updates) => {
        setError(null);
        try {
            await api.put(`/groups/${group.id}`, updates);
            await fetchDetails();
            await refreshGroups();
            await selectGroupScope(group.id);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update group");
        }
    };

    const handleActionError = (errorMessage) => {
        setError(errorMessage);
    };

    const clearError = () => {
        setError(null);
    };

    // Format the creation date nicely
    const formatCreationDate = (isoString) => {
        if (!isoString) return 'Unknown';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (isLoading) return null;

    return (
        <div className="scoreModal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>
                    <GroupName group={group} />
                </h2>
                <button onClick={onClose} className="modal-close-btn">×</button>
            </div>

            <ErrorMessage message={error} onDismiss={clearError} />

            <div className="modal-tabs">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`modal-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                >
                    Members
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`modal-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                >
                    Settings
                </button>
            </div>

            {activeTab === 'members' && (
                <>
                    <InviteCodeDisplay
                        group={group}
                        isAdmin={isAdmin}
                        onUpdate={(newCode) => setGroup({ ...group, invite_code: newCode })}
                        onError={handleActionError}
                    />
                    <MemberList
                        group={group}
                        members={members}
                        isAdmin={isAdmin}
                        onUpdate={fetchDetails}
                        onError={handleActionError}
                    />
                </>
            )}

            {activeTab === 'settings' && (
                <div>
                    {/* Group Info */}
                    <div className="modal-info-box">
                        <div className="modal-info-label">Group created</div>
                        <div className="modal-info-value">{formatCreationDate(group.created_at)}</div>
                    </div>

                    {isAdmin ? (
                        <div style={{ marginBottom: '20px' }}>
                            <div className="formGroup">
                                <label>Group Name</label>
                                <input
                                    type="text"
                                    defaultValue={group.name}
                                    onBlur={(e) => {
                                        if (e.target.value !== group.name) {
                                            handleUpdateGroup({ name: e.target.value });
                                        }
                                    }}
                                />
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={group.include_historical_data}
                                        onChange={(e) => handleUpdateGroup({ include_historical_data: e.target.checked })}
                                    />
                                    Include historical data
                                </label>
                                <div className="checkbox-help">
                                    When disabled, only scores from {formatCreationDate(group.created_at)} onwards will be shown.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#ccc', fontStyle: 'italic' }}>Only admins can change group settings.</p>
                    )}

                    <div className="modal-danger-zone">
                        <button onClick={handleLeave} className="btn-danger-outline">
                            Leave Group
                        </button>

                        {isAdmin && (
                            <button onClick={handleDelete} className="btn-danger">
                                Delete Group
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSettingsModal;