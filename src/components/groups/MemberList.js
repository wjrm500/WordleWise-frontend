import React, { useContext } from 'react';
import api from '../../utilities/api';
import AuthContext from '../../contexts/AuthContext';

const MemberList = ({ group, members, isAdmin, onUpdate, onError }) => {
    const { user: currentUser } = useContext(AuthContext);

    const handleRemove = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await api.delete(`/groups/${group.id}/members/${memberId}`);
            onUpdate();
        } catch (error) {
            onError(error.response?.data?.error || "Failed to remove member");
        }
    };

    const handleRoleChange = async (memberId, newRole) => {
        try {
            await api.put(`/groups/${group.id}/members/${memberId}`, { role: newRole });
            onUpdate();
        } catch (error) {
            onError(error.response?.data?.error || "Failed to update role");
        }
    };

    return (
        <div>
            <h3 style={{ fontSize: '1rem' }}>Members ({members.length}/4)</h3>
            <ul className="member-list">
                {members.map(member => (
                    <li key={member.id} className="member-list-item">
                        <div>
                            <span className="member-username">{member.username}</span>
                            {member.id === currentUser.id && <span className="member-you-label">(You)</span>}
                            <div className="member-joined">
                                Joined: {new Date(member.joined_at).toLocaleDateString('en-GB')}
                            </div>
                        </div>

                        <div className="member-actions">
                            {isAdmin && member.id !== currentUser.id ? (
                                <>
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        className="member-role-select"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                    <button
                                        onClick={() => handleRemove(member.id)}
                                        className="member-remove-btn"
                                        title="Remove member"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <span className={`member-role-badge ${member.role === 'admin' ? 'admin' : 'member'}`}>
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