// src/components/Onboarding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Grid, Typography } from '@mui/material';

const Onboarding = () => {
  const navigate = useNavigate();  // Hook para la navegación

  const openStripeCheckout = () => {
    window.open('https://buy.stripe.com/9AQg0aaHGa6xal2144', '_blank', 'noopener,noreferrer');
  }
  

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Typography variant="h2" >Selecciona como deseas iniciar</Typography>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={openStripeCheckout}
          >
            $200 MXN al mes. para 100 Contenidos de blog
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => navigate('/onboarding-apikey')}
          >
            Aplicación Gratuita usando mi propia API Key de OpenAI
          </Button>
        </Grid>
      </Grid>
      <Typography variant="p" >Si no tienes cuenta de OpenAI y no tienes un API key disponible te recomendamos iniciar con la cuenta básica de $200 MXN al mes</Typography>
    </Container>
  );
};

export default Onboarding;
