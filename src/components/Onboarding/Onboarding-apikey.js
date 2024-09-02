// src/components/Onboarding.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Avatar, Typography,
  TextField, Button, Grid, FormControlLabel,
  Checkbox
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/ContentCopy';
import AccountSettings from '../Accounts/AccountSettings';
import AccountAPI from '../Accounts/AccountAPI';



const Onboarding = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();  // Hook para la navegación

  const handleOnSubmitSuccess = () => {
    navigate('/dashboard'); // Redirige a /dashboard
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
        <Typography component="p" variant="p">
          Completa la mayor cantidad de datos que sea posible en este momento. Si no tienes los datos de tu API key de OpenAI recuerda que no te sera posible acceder a las funcionalidades de la aplicación.
        </Typography>
      <AccountSettings 
            onSubmitSuccess={handleOnSubmitSuccess} 
            submitButtonText="Crear Cuenta" 
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
