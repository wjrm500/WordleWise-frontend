import { createContext } from 'react';

const AuthContext = createContext({
    user: null,           // { id, username, forename, admin }
    token: null,
    login: async (username, password) => { },
    logout: () => { },
    isAuthenticated: false,
    isSiteAdmin: false
});

export default AuthContext;
