// src/components/Onboarding.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Avatar, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/ContentCopy';
import AccountSettings from '../Accounts/AccountSettings';
import { doc, setDoc, getFirestore, collection, getDoc, getDocs, query, where } from 'firebase/firestore'; 
import { AuthContext } from '../../AuthContext'; 





const Onboarding = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();  // Hook para la navegación
  const openaikey = "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";
  const stripe_subscriber = "true";
  const { currentUser } = useContext(AuthContext); // Obtener currentUser desde AuthContext



const handleOnSubmitSuccess = async () => {
  try {
      if (!currentUser) {
          console.error('Usuario no autenticado. No se puede actualizar el Business.');
          return;
      }

      const businessData = {
          userId: currentUser.uid,
          openaikey: openaikey,
          stripe_subscriber: stripe_subscriber
      };

      const businessCollection = collection(getFirestore(), 'Business');
      await setDoc(doc(businessCollection, currentUser.uid), businessData, { merge: true });

      console.log('Datos de Business actualizados exitosamente.');
      navigate('/dashboard'); // Redirige a /dashboard
     
  } catch (error) {
      console.error('Error al actualizar los datos de Business:', error);
  }
};


  return (
    <Container component="main" maxWidth="xs">
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {successMessage && (  // Muestra el mensaje de éxito si existe
        <Typography color="success" align="center" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Completa tus datos para comenzar a crear tu contenido con AI
        </Typography>
      </Box>
      <Typography component="h2" variant="h5">
          PASO #1 Define los datos de tu cuenta
        </Typography>
      <AccountSettings 
            onSubmitSuccess={handleOnSubmitSuccess} 
            submitButtonText="Guardar datos de la cuenta" 
        />
        <Box
        sx={{
          marginTop: 8,
          marginBottom: 3,
     
        }}
      >
        </Box>

      
        
      <Typography variant="body2" align="center" sx={{ mt: 8 }}>
        Copyright ©{' '}
        <a href="https://mui.com/" variant="inherit">
          Your Website
        </a>{' '}
        2023.
      </Typography>
    </Container>
  );
};

export default Onboarding;
