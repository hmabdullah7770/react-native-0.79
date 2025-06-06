import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cleanUsername, setCleanUsername] = useState(null);
    const [azureUsername, setAzureUsername] = useState(null);

    return (
        <AuthContext.Provider value={{
            cleanUsername,
            setCleanUsername,
            azureUsername,
            setAzureUsername
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};