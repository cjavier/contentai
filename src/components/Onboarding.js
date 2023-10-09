// src/components/Onboarding.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Avatar, Typography,
  TextField, Button, Grid, FormControlLabel,
  Checkbox
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/ContentCopy';
import AccountSettings from './AccountSettings';
import AccountAPI from './AccountAPI';



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
      <AccountSettings 
            //onSubmitSuccess={handleOnSubmitSuccess} 
            submitButtonText="Guardar datos de la cuenta" 
        />
        <Box
        sx={{
          marginTop: 8,
          marginBottom: 3,
     
        }}
      >
        <Typography component="h2" variant="h5">
          PASO #2 Agrega el API key de OpenAI
        </Typography>
        <Typography component="p">
          Si no sabes como obtener el API key de Open AI te lo explicamos en este pequeño video:
        </Typography>
        {/* Video embebido de YouTube */}
  <iframe 
    width="100%" 
    height="250" 
    src="https://www.youtube.com/embed/VpcpHjeLZSs" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
        <AccountAPI 
            onSubmitSuccess={handleOnSubmitSuccess} 
            submitButtonText="Iniciar con mi contenido" 
        />
        </Box>
        <Typography component="p">
          Este paso es fundamental para poder usar el generador de contenido, si no tienes un API Key de OpenAI no lo podrás usar.
        </Typography>
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
