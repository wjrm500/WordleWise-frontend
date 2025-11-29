import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    login: async (username, password) => { },
    logout: () => { },
    updateUser: (updates) => { },
    isAuthenticated: false,
});

export default AuthContext;
