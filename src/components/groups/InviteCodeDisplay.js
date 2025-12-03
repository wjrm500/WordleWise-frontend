import React, { useState } from 'react';
import api from '../../utilities/api';

const InviteCodeDisplay = ({ group, isAdmin, onUpdate, onError }) => {
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleRegenerate = async () => {
        if (!window.confirm('Are you sure? The old code will stop working.')) return;

        setIsRegenerating(true);
        try {
            const response = await api.post(`/groups/${group.id}/regenerate-code`);
            if (response.data.success) {
                onUpdate(response.data.invite_code);
            }
        } catch (error) {
            onError(error.response?.data?.error || "Failed to regenerate code");
        } finally {
            setIsRegenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(group.invite_code);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="invite-code-section">
            <h3 className="invite-code-title">Invite code</h3>
            <div className="invite-code-row">
                <div className="invite-code-display">
                    {group.invite_code}
                </div>
                <button
                    onClick={copyToClipboard}
                    className={`invite-code-copy-btn ${copySuccess ? 'success' : ''}`}
                    title={copySuccess ? "Copied!" : "Copy to clipboard"}
                >
                    {copySuccess ? '✓' : '📋'}
                </button>
            </div>

            {isAdmin && (
                <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="invite-code-regen-btn"
                >
                    {isRegenerating ? 'Regenerating...' : 'Regenerate code'}
                </button>
            )}
        </div>
    );
};

export default InviteCodeDisplay;