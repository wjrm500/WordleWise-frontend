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
        <div className="scoreModal create-group-modal">
            <h2 style={{ marginTop: 0 }}>Create Group</h2>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label>Group Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={15}
                        placeholder="e.g. Office Wordlers"
                    />
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={includeHistorical}
                            onChange={(e) => setIncludeHistorical(e.target.checked)}
                        />
                        Include historical data
                    </label>
                    <div className="checkbox-help">
                        If checked, past scores of members will be visible in the group.
                    </div>
                </div>

                <div className="modal-button-row">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroupModal;