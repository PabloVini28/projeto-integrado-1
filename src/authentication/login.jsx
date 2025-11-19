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
  const [apiError, setApiError] = useState('');      

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setShowError(true);
    setApiError(''); 
    
    if (!validateEmail(email)) {
      return; 
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login realizado com sucesso:", data);
        
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user)); 
        
        navigate('/');
      } else {
        setApiError(data.error || 'Falha ao realizar login.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setApiError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    navigate('/esqueci-senha');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (apiError) setApiError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (apiError) setApiError('');
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
          
          {apiError && (
            <Typography 
              color="error" 
              variant="body2" 
              align="center" 
              sx={{ mb: 2, fontWeight: 'bold', backgroundColor: '#ffebee', p: 1, borderRadius: 1 }}
            >
              {apiError}
            </Typography>
          )}

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
            onChange={handlePasswordChange}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;