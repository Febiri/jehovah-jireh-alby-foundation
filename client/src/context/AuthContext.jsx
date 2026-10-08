import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jjaf_admin_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jjaf_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('jjaf_admin_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        })
        .catch(() => {
          // Keep offline state or network failure
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('jjaf_admin_token', authToken);
    localStorage.setItem('jjaf_admin_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jjaf_admin_token');
    localStorage.removeItem('jjaf_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
