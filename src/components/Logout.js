import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();  

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('Sesión cerrada exitosamente.');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar la sesión:', error.message);
    }
  };

  return (
    <Button 
      variant="contained" 
      color="error" 
      onClick={handleLogout}
    >
      Cerrar sesión
    </Button>
  );
};

export default Logout;
