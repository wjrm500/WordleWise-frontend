import { createContext } from 'react';

const ScopeContext = createContext({
    // Data
    groups: [],
    currentScope: null,
    scores: null,

    // Derived
    isPersonalScope: false,
    isGroupScope: false,
    hasGroups: false,
    scopeMembers: [],
    currentGroupRole: null,
    isGroupAdmin: false,

    // Actions
    selectScope: (scope) => { },
    selectPersonalScope: () => { },
    selectGroupScope: (groupId) => { },
    refreshGroups: async () => { },
    refreshScores: async () => { },
    addScore: async (date, score) => { },

    // Loading states
    isLoading: false,
    isScoresLoading: false
});

export default ScopeContext;