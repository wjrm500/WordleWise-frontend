import React, { useState, useContext } from 'react';
import api from '../../utilities/api';
import ScopeContext from '../../contexts/ScopeContext';
import ErrorMessage from '../common/ErrorMessage';

const CreateGroupModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const [includeHistorical, setIncludeHistorical] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { refreshGroups, selectGroupScope } = useContext(ScopeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/groups', {
                name,
                include_historical_data: includeHistorical
            });

            if (response.data.success) {
                await refreshGroups();
                selectGroupScope(response.data.group.id);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create group');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="modalOverlay">
            <div className="scoreModal" style={{ minWidth: '300px', maxWidth: '400px', display: 'block' }}>
                <h2 style={{ marginTop: 0 }}>Create Group</h2>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Group Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            placeholder="e.g. Office Wordlers"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={includeHistorical}
                                onChange={(e) => setIncludeHistorical(e.target.checked)}
                            />
                            Include historical data
                        </label>
                        <div style={{ fontSize: '0.8em', color: '#ccc', marginTop: '4px', marginLeft: '24px' }}>
                            If checked, past scores of members will be visible in the group.
                        </div>
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
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
