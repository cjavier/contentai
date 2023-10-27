import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getAuth } from './firebase';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = useMemo(() => getAuth(), []);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      user => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      error => {
        console.error("Firebase Auth Error:", error);
        setLoading(false);
        setError(error);
      }
    );
    return unsubscribe;
  }, [auth]);

  const contextValue = useMemo(() => ({ currentUser, loading, error }), [currentUser, loading, error]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
