import { createContext } from 'react';

const AuthContext = createContext({
    user: null,           // { id, username, forename }
    token: null,
    login: async (username, password) => { },
    logout: () => { },
    isAuthenticated: false,
});

export default AuthContext;
