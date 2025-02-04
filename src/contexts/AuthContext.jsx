import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { accounts } = useMsal();
    const [user, setUser] = useState(null);
    
    const adminEmails = [
        'supunse@masholdings.com',
        'nuwans@masholdings.com'
    ];

    useEffect(() => {
        if (accounts.length > 0) {
            const userEmail = accounts[0].username.toLowerCase();
            setUser({
                email: userEmail,
                name: accounts[0].name || accounts[0].username,
                isAdmin: adminEmails.includes(userEmail)
            });
        } else {
            setUser(null);
        }
    }, [accounts]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;