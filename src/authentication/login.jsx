import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import logoImage from '../assets/logo/logo.png';

const Logo = () => (
  <Box
    component="img"
    sx={{
      width: 160, 
      height: 'auto',
      mb: 3,
    }}
    alt="CF Gestão Logo"
    src={logoImage}
  />
);

function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 6, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
        }}
      >
        <Logo />

        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>

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