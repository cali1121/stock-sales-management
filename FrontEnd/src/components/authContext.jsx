import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const getAuthDataFromToken = (t) => {
        if (!t) return { isLoggedIn: false, isAdmin: false, user: null };
        try {
            const payload = jwtDecode(t);
            const adminStatus = payload.rol === 'admin';
            return { isLoggedIn: true, isAdmin: adminStatus, user: payload };
        } catch (e) {
            console.error("Error al decodificar el token:", e);
            return { isLoggedIn: false, isAdmin: false, user: null };
        }
    };

    const login = (t) => {
        localStorage.setItem('authToken', t);
        setToken(t);
        const authData = getAuthDataFromToken(t);
        setIsLoggedIn(authData.isLoggedIn);
        setIsAdmin(authData.isAdmin);
        setUser(authData.user);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
        window.location.reload();
    };

    useEffect(() => {
        const t = localStorage.getItem('authToken');
        const authData = getAuthDataFromToken(t);
        setToken(t);
        setIsLoggedIn(authData.isLoggedIn);
        setIsAdmin(authData.isAdmin);
        setUser(authData.user);
    }, []);

    const value = { isLoggedIn, isAdmin, login, logout, token, user };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
