import React, { useState, useEffect, useContext } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '../firebase';
import { Container, Avatar, Typography, Box, TextField, FormControlLabel, Checkbox, Button, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { getAuth } from '../firebase';
import { initializeApp } from "firebase/app";
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom'; 




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); 


  const handleLogin = async () => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Usuario autenticado exitosamente
        const user = userCredential.user;
        console.log('Autentificación exitosa de:', user.email);
        navigate('/dashboard'); 

    } catch (error) {
        console.error('Error en la autenticación:', error.message);
        setError(error.message);
    }
};

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Usuario autenticado exitosamente con Google
    } catch (error) {
      console.error('Error en la autenticación con Google:', error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
        {error && (
      <Typography color="error" align="center" sx={{ mt: 2 }}>
        {error}
      </Typography>
    )}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <a href="#" variant="body2">
                Forgot password?
              </a>
            </Grid> */}
            <Grid item>
              <a href="/registro" variant="body2">
                {"No tienes cuenta? Regístrate"}
              </a>
            </Grid>
            <Grid item xs>
  <a href="/recuperar-contrasena" variant="body2">
    ¿Olvidaste tu contraseña?
  </a>
</Grid>

          </Grid>
        </Box>
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

export default Login;