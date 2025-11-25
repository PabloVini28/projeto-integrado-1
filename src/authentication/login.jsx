import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import logoImage from '../assets/logo/icon.png';

const Logo = () => (
  <Box
    component="img"
    sx={{
      width: 60,
      height: 'auto',
      mb: 1,
    }}
    alt="CF Gestão Logo"
    src={logoImage}
  />
);

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setShowError(true); 
    
    if (!validateEmail(email)) {
      return; 
    }
    console.log("Navegando para a página inicial...");
    navigate('/');
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    navigate('/esqueci-senha');
  };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const isEmailValid = validateEmail(email);
  const displayEmailError = showError && !isEmailValid;

  return (
    <Container
      component="main"
      sx={{
        maxWidth: '340px !important',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Logo />

        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 400,
            mb: 3,
            color: 'text.secondary',
          }}
        >
          Corpo em Forma Gestão
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
            error={displayEmailError}
            helperText={displayEmailError ? 'Formato de e-mail inválido.' : ''}
          />
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 1,
            }}
          >
            <Link
              href="#"
              variant="body2"
              onClick={handleForgotPasswordClick}
              sx={{ cursor: 'pointer' }}
            >
              Esqueceu sua senha?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email || !password} 
            sx={{
              mt: 2,
              mb: 2,
              py: 1.2,
              backgroundColor: '#F2D95C',
              color: 'black',
              '&:hover': {
                backgroundColor: '#E0C84D',
              },
              '&.Mui-disabled': {
                backgroundColor: '#F7E9A9',
                color: 'rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            Entrar
          </Button>
          
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;