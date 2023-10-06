// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getAuth } from './firebase';


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Nuevo estado para manejar la carga


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
     // console.log('Usuario desde onAuthStateChanged:', user);
      setCurrentUser(user);
      setLoading(false);  // Actualizar el estado de carga una vez que se recibe el usuario
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (currentUser) {
      console.log('Nombre del usuario:', currentUser.email);
    }
  }, [currentUser]);  // Este useEffect se ejecutará cada vez que currentUser cambie

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
