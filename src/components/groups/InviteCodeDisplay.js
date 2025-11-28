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
        <div style={{ background: 'var(--blue-1)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Invite Code</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    background: 'white',
                    color: 'black',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid var(--blue-2)',
                    flex: 1,
                    textAlign: 'center'
                }}>
                    {group.invite_code}
                </div>
                <button
                    onClick={copyToClipboard}
                    style={{ 
                        padding: '10px', 
                        cursor: 'pointer', 
                        background: copySuccess ? '#34a853' : 'var(--blue-2)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        transition: 'background 0.2s ease',
                        width: '40px',
                        height: '40px',
                    }}
                    title={copySuccess ? "Copied!" : "Copy to clipboard"}
                >
                    {copySuccess ? '✓' : '📋'}
                </button>
            </div>

            {isAdmin && (
                <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    style={{
                        marginTop: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#ccc',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    {isRegenerating ? 'Regenerating...' : 'Regenerate Code'}
                </button>
            )}
        </div>
    );
};

export default InviteCodeDisplay;
