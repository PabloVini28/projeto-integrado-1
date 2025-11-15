import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
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

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [showError, setShowError] = useState(false); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setShowError(true);
    setStatus({ message: '', type: '' });

    if (!validateEmail(email)) {
      return; 
    }

    setLoading(true);

    try {
      const result = await window.api.solicitarResetSenha(email);
      
      if (result.success) {
        setStatus({ message: result.message, type: 'success' });
        setEmail('');
        setShowError(false); 
      } else {
        setStatus({ message: result.message, type: 'error' });
      }
    } catch (error) {
      console.error("Erro na comunicação IPC:", error);
      setStatus({ message: 'Erro: Falha na comunicação com o sistema.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate('/login');
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
            mb: 1,
            color: 'text.secondary',
          }}
        >
          Corpo em Forma Gestão
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 500,
            mt: 2,
            mb: 1,
          }}
        >
          Recupere sua senha
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: 'text.secondary',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Informe seu e-mail para um link de redefinição.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          
          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={displayEmailError} 
            helperText={displayEmailError ? 'Formato de e-mail inválido.' : ''}
          />
          
          {!displayEmailError && status.message && (
            <Alert severity={status.type} sx={{ mt: 2, mb: 1 }}>
              {status.message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email}
            sx={{
              mt: 2,
              mb: 3,
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Link'}
          </Button>
          
          <Typography variant="body2" align="center">
            Lembrou da sua senha?{' '}
            <Link
              href="#"
              onClick={handleGoBack}
              variant="body2"
              sx={{
                fontWeight: 'bold',
              }}
            >
              Voltar ao login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;