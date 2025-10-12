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
import logoImage from '../assets/logo/iconblue.png'; 

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
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Navegando para a página inicial...");
    navigate('/');
  };

  const handleForgotPasswordClick = (event) => {
      event.preventDefault();
      // Usa o useNavigate para ir para a rota que definimos no main.jsx
      navigate('/esqueci-senha'); 
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

        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            fontWeight: 400, 
            mb: 3, 
            color: 'text.secondary' 
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
            autoComplete="email"
            autoFocus
            value={email} // Define o valor atual do campo
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            disabled={loading} // Desabilita durante o carregamento
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
            value={password} // Define o valor atual do campo
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
            disabled={loading} // Desabilita durante o carregamento
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
                sx={{ cursor: 'pointer' }} // Boa prática para indicar que é clicável
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
                backgroundColor: '#F7E9A9', // Amarelo bem claro para desativado
                color: 'rgba(0, 0, 0, 0.4)', // Texto um pouco apagado
              },
            }}
          >
            Entrar
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