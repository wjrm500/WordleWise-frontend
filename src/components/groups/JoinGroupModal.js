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
        <div className="scoreModal" style={{ minWidth: '300px', maxWidth: '400px', display: 'block' }}>
            <h2 style={{ marginTop: 0 }}>Join Group</h2>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Invite Code</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}
                            placeholder="ENTER CODE"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '8px 16px', cursor: 'pointer', background: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ padding: '8px 16px', cursor: 'pointer', background: 'var(--blue-1)', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            {isLoading ? 'Joining...' : 'Join'}
                        </button>
                    </div>
                </form>
        </div>
    );
};

export default JoinGroupModal;
