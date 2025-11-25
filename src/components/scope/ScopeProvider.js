import React, { useState, useEffect, useContext, useMemo } from 'react';
import ScopeContext from '../../contexts/ScopeContext';
import AuthContext from '../../contexts/AuthContext';
import api from '../../utilities/api';

const ScopeProvider = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [currentScope, setCurrentScope] = useState(null);
    const [scores, setScores] = useState(null);  // Changed from [] to null for clearer loading state
    const [isLoading, setIsLoading] = useState(true);
    const [isScoresLoading, setIsScoresLoading] = useState(false);  // New: track score loading separately

    // Fetch groups on mount / auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchGroups();
        } else {
            setGroups([]);
            setCurrentScope(null);
            setScores(null);
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Initialize scope after groups loaded
    useEffect(() => {
        if (isAuthenticated && groups !== null && currentScope === null) {
            initializeScope();
        }
    }, [groups, isAuthenticated]);

    // Fetch scores when scope changes
    useEffect(() => {
        if (isAuthenticated && currentScope) {
            fetchScores();
        }
    }, [currentScope, isAuthenticated]);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchScores = async () => {
        if (!currentScope) return;

        // Set loading state and clear old scores to prevent flash
        setIsScoresLoading(true);
        setScores(null);

        try {
            const payload = {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                scope: currentScope.type === 'personal' ? 'personal' : {
                    type: 'group',
                    groupId: currentScope.group.id
                }
            };

            const response = await api.post('/getScores', payload);
            setScores(response.data);
        } catch (error) {
            console.error("Failed to fetch scores:", error);
            setScores([]);  // Set empty array on error so UI doesn't hang
        } finally {
            setIsScoresLoading(false);
        }
    };

    const addScore = async (date, score) => {
        try {
            await api.post("/addScore", {
                date,
                score,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            await fetchScores();
        } catch (error) {
            console.error("Failed to add score:", error);
            throw error;
        }
    };

    const initializeScope = () => {
        const lastScopeType = localStorage.getItem('lastScopeType');
        const lastGroupId = localStorage.getItem('lastGroupId');

        if (lastScopeType === 'group' && lastGroupId) {
            const group = groups.find(g => g.id === parseInt(lastGroupId));
            if (group) {
                selectGroupScope(group.id);
                return;
            }
        }

        selectPersonalScope();
    };

    const selectPersonalScope = () => {
        // Clear scores immediately to prevent showing stale data
        setScores(null);
        setCurrentScope({ type: 'personal' });
        localStorage.setItem('lastScopeType', 'personal');
        localStorage.removeItem('lastGroupId');
    };

    const selectGroupScope = async (groupId) => {
        // Clear scores immediately to prevent showing stale data
        setScores(null);
        
        try {
            const response = await api.get(`/groups/${groupId}`);
            setCurrentScope({ type: 'group', group: response.data });
            localStorage.setItem('lastScopeType', 'group');
            localStorage.setItem('lastGroupId', groupId.toString());
        } catch (error) {
            console.error("Failed to select group scope:", error);
            selectPersonalScope();
        }
    };

    // Derived values
    const isPersonalScope = currentScope?.type === 'personal';
    const isGroupScope = currentScope?.type === 'group';
    const hasGroups = groups.length > 0;

    const scopeMembers = useMemo(() => {
        if (!user) return [];

        if (isPersonalScope) {
            return [{ id: user.id, username: user.username, forename: user.forename }];
        }
        if (isGroupScope && currentScope.group) {
            return currentScope.group.members.map(m => ({
                id: m.id,
                username: m.username,
                forename: m.forename
            }));
        }
        return [];
    }, [currentScope, user, isPersonalScope, isGroupScope]);

    const currentGroupRole = isGroupScope && currentScope.group ? currentScope.group.current_user_role : null;
    const isGroupAdmin = currentGroupRole === 'admin';

    return (
        <ScopeContext.Provider value={{
            groups,
            currentScope,
            scores,
            isPersonalScope,
            isGroupScope,
            hasGroups,
            scopeMembers,
            currentGroupRole,
            isGroupAdmin,
            selectScope: (scope) => scope.type === 'personal' ? selectPersonalScope() : selectGroupScope(scope.groupId),
            selectPersonalScope,
            selectGroupScope,
            refreshGroups: fetchGroups,
            refreshScores: fetchScores,
            addScore,
            isLoading,
            isScoresLoading  // Expose this so components know when scores are loading
        }}>
            {children}
        </ScopeContext.Provider>
    );
};

export default ScopeProvider;