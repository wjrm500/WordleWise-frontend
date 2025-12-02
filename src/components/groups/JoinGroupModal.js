import React, { useState, useContext } from 'react';
import api from '../../utilities/api';
import ScopeContext from '../../contexts/ScopeContext';
import ErrorMessage from '../common/ErrorMessage';

const JoinGroupModal = ({ onClose }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { refreshGroups, selectGroupScope } = useContext(ScopeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/groups/join', {
                invite_code: inviteCode
            });

            if (response.data.success) {
                await refreshGroups();
                selectGroupScope(response.data.group.id);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join group');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="scoreModal join-group-modal">
            <h2 style={{ marginTop: 0 }}>Join Group</h2>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label>Invite Code</label>
                    <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        required
                        className="join-code-input"
                        placeholder="ENTER CODE"
                    />
                </div>

                <div className="modal-button-row">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Joining...' : 'Join'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinGroupModal;