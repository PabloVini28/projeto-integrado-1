import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Link, Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import logoImage from '../assets/logo/logocf3.png'; 

const Logo = () => (
  <Box
    component="img"
    sx={{
      width: 120, 
      height: 'auto',
      mb: 2,
    }}
    alt="CF Gestão Logo"
    src={logoImage}
  />
);

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Navegando para a página inicial...");
    navigate('/');
  };

  return (
    <Container 
      component="main" 
      sx={{ 
        maxWidth: '340px !important', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%' 
        }}
      >
        <Logo />
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
            Acesse sua conta
          </Typography>
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
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
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 1,
            }}
          >
            <Link href="#" variant="body2">
              Esqueceu sua senha?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.2,
              backgroundColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                backgroundColor: '#d5d5d5',
              },
            }}
          >
            Entrar
          </Button>
          <Divider sx={{ my: 2 }}>Ou</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.2,
              color: 'text.secondary',
              borderColor: 'grey.400'
            }}
          >
            Continuar com Google
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Não tem uma conta?{' '}
            <Link href="#" variant="body2">
              Crie agora mesmo
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;