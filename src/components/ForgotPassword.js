import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
  
    const handleResetPassword = async () => {
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage('Se ha enviado un correo electrónico para restablecer tu contraseña.');
      } catch (error) {
        console.error('Error al enviar el correo de restablecimiento:', error.message);
        setError(error.message);
      }
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Restablecer contraseña
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </Typography>
          {message && (
            <Typography color="primary" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleResetPassword}
            >
              Restablecer contraseña
            </Button>
          </Box>
        </Box>
      </Container>
    );
  };
  
  export default ForgotPassword;
  