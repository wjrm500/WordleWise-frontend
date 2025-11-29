import { createContext } from 'react';

const ScopeContext = createContext({
    groups: [],
    currentScope: null,
    scores: null,
    defaultGroupId: null,

    isPersonalScope: false,
    isGroupScope: false,
    hasGroups: false,
    scopeMembers: [],
    currentGroupRole: null,
    isGroupAdmin: false,

    selectScope: (scope) => { },
    selectPersonalScope: () => { },
    selectGroupScope: (groupId) => { },
    refreshGroups: async () => { },
    refreshScores: async () => { },
    addScore: async (date, score) => { },
    setDefaultScope: async (type, groupId) => { },

    isLoading: false,
    isScoresLoading: false
});

export default ScopeContext;
