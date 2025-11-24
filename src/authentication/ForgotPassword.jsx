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

const blackFocusedTextFieldStyle = {
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'black',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'black',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#343a40',
  },
};

const errorTextFieldStyle = {
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: 'red !important',
    },
    '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'darkred !important',
    },
    '& .MuiInputLabel-root.Mui-error': {
        color: 'red !important',
    },
};


const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

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
  const [ipcStatus, setIpcStatus] = useState({ message: '', type: '' });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError(false);
    setErrorMessage('');
    setFieldErrors({});
    setIpcStatus({ message: '', type: '' });

    if (!validateEmail(email)) {
        setFieldErrors({email: true});
        setErrorMessage("Formato de e-mail inválido.");
        setError(true);
        return;
    }

    setLoading(true);

    try {
      const result = await new Promise(resolve => {
          setTimeout(() => {
              if (email === "test@admin.com") {
                  resolve({ success: true, message: 'Link de recuperação enviado com sucesso!' });
              } else {
                  resolve({ success: false, message: 'E-mail não encontrado.' });
              }
          }, 1500);
      });
      
      if (result.success) {
        setIpcStatus({ message: result.message, type: 'success' });
        setEmail('');
        setError(false); 
      } else {
        setIpcStatus({ message: result.message, type: 'error' });
        setErrorMessage(result.message);
        setError(true);
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
      setIpcStatus({ message: 'Erro: Falha na comunicação com o sistema.', type: 'error' });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
        setError(false);
        setFieldErrors({});
        setErrorMessage('');
        setIpcStatus({message: '', type: ''});
    }
  };

  const isEmailError = !!fieldErrors.email || (error && ipcStatus.message);

  const displayErrorMessage = isEmailError ? errorMessage || ipcStatus.message : '';

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
            onChange={handleEmailChange}
            disabled={loading}
            error={isEmailError} 
            helperText={isEmailError ? displayErrorMessage : ''}
            sx={{...blackFocusedTextFieldStyle, ...(isEmailError && errorTextFieldStyle)}}
          />
          
          {ipcStatus.type === 'success' && (
            <Alert severity={ipcStatus.type} sx={{ mt: 2, mb: 1 }}>
              {ipcStatus.message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email.trim()}
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