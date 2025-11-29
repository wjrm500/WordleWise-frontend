import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import ScopeContext from '../../contexts/ScopeContext';
import AuthContext from '../../contexts/AuthContext';
import api from '../../utilities/api';

const ScopeProvider = ({ children }) => {
    const { user, isAuthenticated, updateUser } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [currentScope, setCurrentScope] = useState(null);
    const [scores, setScores] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScoresLoading, setIsScoresLoading] = useState(false);
    const [defaultGroupId, setDefaultGroupId] = useState(null);
    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const [scopeInitialized, setScopeInitialized] = useState(false);

    // Reset everything on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setGroups([]);
            setCurrentScope(null);
            setScores(null);
            setDefaultGroupId(null);
            setGroupsLoaded(false);
            setScopeInitialized(false);
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch groups when authenticated
    useEffect(() => {
        if (isAuthenticated && !groupsLoaded) {
            const fetchGroups = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get('/groups');
                    setGroups(response.data);
                    if (user?.default_group_id !== undefined) {
                        setDefaultGroupId(user.default_group_id);
                    }
                } catch (error) {
                    console.error("Failed to fetch groups:", error);
                    setGroups([]);
                } finally {
                    setIsLoading(false);
                    setGroupsLoaded(true);
                }
            };
            fetchGroups();
        }
    }, [isAuthenticated, groupsLoaded, user?.default_group_id]);

    // Initialize scope AFTER groups are loaded
    useEffect(() => {
        if (!isAuthenticated || !groupsLoaded || scopeInitialized) return;

        const initializeScope = async () => {
            // Priority 1: User's default scope from database
            if (user?.default_group_id) {
                const defaultGroup = groups.find(g => g.id === user.default_group_id);
                if (defaultGroup) {
                    try {
                        const response = await api.get(`/groups/${defaultGroup.id}`);
                        setCurrentScope({ type: 'group', group: response.data });
                        localStorage.setItem('lastScopeType', 'group');
                        localStorage.setItem('lastGroupId', defaultGroup.id.toString());
                        setScopeInitialized(true);
                        return;
                    } catch (error) {
                        console.error("Failed to load default group:", error);
                    }
                }
            }

            // Priority 2: localStorage fallback (for backward compatibility)
            const lastScopeType = localStorage.getItem('lastScopeType');
            const lastGroupId = localStorage.getItem('lastGroupId');
            if (lastScopeType === 'group' && lastGroupId) {
                const group = groups.find(g => g.id === parseInt(lastGroupId));
                if (group) {
                    try {
                        const response = await api.get(`/groups/${group.id}`);
                        setCurrentScope({ type: 'group', group: response.data });
                        localStorage.setItem('lastScopeType', 'group');
                        localStorage.setItem('lastGroupId', group.id.toString());
                        setScopeInitialized(true);
                        return;
                    } catch (error) {
                        console.error("Failed to load group from localStorage:", error);
                    }
                }
            }

            // Priority 3: Personal scope (default fallback)
            setCurrentScope({ type: 'personal' });
            localStorage.setItem('lastScopeType', 'personal');
            localStorage.removeItem('lastGroupId');
            setScopeInitialized(true);
        };

        initializeScope();
    }, [isAuthenticated, groupsLoaded, scopeInitialized, groups, user?.default_group_id]);

    // Fetch scores when scope changes
    useEffect(() => {
        if (!currentScope || !scopeInitialized) return;

        const fetchScores = async () => {
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
                setScores([]);
            } finally {
                setIsScoresLoading(false);
            }
        };

        fetchScores();
    }, [currentScope, scopeInitialized]);

    const selectPersonalScope = useCallback(() => {
        setScores(null);
        setCurrentScope({ type: 'personal' });
        localStorage.setItem('lastScopeType', 'personal');
        localStorage.removeItem('lastGroupId');
    }, []);

    const selectGroupScope = useCallback(async (groupId) => {
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
    }, [selectPersonalScope]);

    const refreshGroups = useCallback(async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        }
    }, []);

    const refreshScores = useCallback(async () => {
        if (!currentScope) return;

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
            setScores([]);
        } finally {
            setIsScoresLoading(false);
        }
    }, [currentScope]);

    const addScore = useCallback(async (date, score) => {
        try {
            await api.post("/addScore", {
                date,
                score,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            await refreshScores();
        } catch (error) {
            console.error("Failed to add score:", error);
            throw error;
        }
    }, [refreshScores]);

    const setDefaultScopeHandler = useCallback(async (type, groupId = null) => {
        try {
            const payload = type === 'personal' 
                ? { type: 'personal' }
                : { type: 'group', groupId };
            
            await api.put('/user/default-scope', payload);
            
            const newDefaultGroupId = type === 'personal' ? null : groupId;
            setDefaultGroupId(newDefaultGroupId);
            
            // Update user in AuthContext and localStorage
            updateUser({ default_group_id: newDefaultGroupId });
            
            // Also update localStorage fallback to match
            if (type === 'personal') {
                localStorage.setItem('lastScopeType', 'personal');
                localStorage.removeItem('lastGroupId');
            } else {
                localStorage.setItem('lastScopeType', 'group');
                localStorage.setItem('lastGroupId', groupId.toString());
            }
            
            // Refresh groups to update is_default flags
            await refreshGroups();
            
            return true;
        } catch (error) {
            console.error("Failed to set default scope:", error);
            return false;
        }
    }, [updateUser, refreshGroups]);

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
            defaultGroupId,
            isPersonalScope,
            isGroupScope,
            hasGroups,
            scopeMembers,
            currentGroupRole,
            isGroupAdmin,
            selectScope: (scope) => scope.type === 'personal' ? selectPersonalScope() : selectGroupScope(scope.groupId),
            selectPersonalScope,
            selectGroupScope,
            refreshGroups,
            refreshScores,
            addScore,
            setDefaultScope: setDefaultScopeHandler,
            isLoading,
            isScoresLoading
        }}>
            {children}
        </ScopeContext.Provider>
    );
};

export default ScopeProvider;
