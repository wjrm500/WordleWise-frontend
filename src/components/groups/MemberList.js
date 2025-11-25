import React, { useContext } from 'react';
import api from '../../utilities/api';
import AuthContext from '../../contexts/AuthContext';

const MemberList = ({ group, members, isAdmin, onUpdate }) => {
    const { user: currentUser } = useContext(AuthContext);

    const handleRemove = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await api.delete(`/groups/${group.id}/members/${memberId}`);
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to remove member");
        }
    };

    const handleRoleChange = async (memberId, newRole) => {
        try {
            await api.put(`/groups/${group.id}/members/${memberId}`, { role: newRole });
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to update role");
        }
    };

    return (
        <div>
            <h3 style={{ fontSize: '1rem' }}>Members ({members.length}/4)</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {members.map(member => (
                    <li key={member.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px solid var(--blue-2)'
                    }}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>{member.username}</span>
                            {member.id === currentUser.id && <span style={{ color: '#ccc', fontSize: '0.8em', marginLeft: '5px' }}>(You)</span>}
                            <div style={{ fontSize: '0.8em', color: '#ccc' }}>
                                Joined: {new Date(member.joined_at).toLocaleDateString('en-GB')}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isAdmin && member.id !== currentUser.id ? (
                                <>
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        style={{ padding: '4px', borderRadius: '4px' }}
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                    <button
                                        onClick={() => handleRemove(member.id)}
                                        style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                                        title="Remove member"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <span style={{
                                    background: member.role === 'admin' ? 'var(--blue-2)' : 'var(--blue-1)',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.8em'
                                }}>
                                    {member.role}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberList;
