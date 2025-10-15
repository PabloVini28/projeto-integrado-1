import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress, // Adicionado para indicar carregamento
  Alert,             // Adicionado para exibir mensagens de status
} from '@mui/material';
import logoImage from '../assets/logo/icon.png'; 

// Componente Logo (copiado do LoginPage para manter a consistência)
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
  const [status, setStatus] = useState({ message: '', type: '' }); // {message: 'Mensagem', type: 'success' | 'error'}

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setStatus({ message: '', type: '' }); // Limpa mensagens anteriores
    setLoading(true);
    
    // ⚠️ CHAMADA AO BACK-END SEGURO (via preload.js)
    try {
      // window.api.solicitarResetSenha foi exposto no preload.js
      const result = await window.api.solicitarResetSenha(email); 
      
      if (result.success) {
        setStatus({ message: result.message, type: 'success' });
        // Opcional: Limpar o email após o sucesso
        setEmail('');
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
    // Navega para a rota de login, que definimos como '/login' no main.jsx
    navigate('/login');
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
            mb: 1, 
            color: 'text.secondary' 
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
                whiteSpace: 'nowrap' // Esta propriedade impede quebra de linha
            }}
        >
          Informe seu e-mail para um link de redefinição.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          
          {/* Campo E-mail */}
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
          />
          
          {/* Mensagem de Status (Sucesso/Erro) */}
          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2, mb: 1 }}>
              {status.message}
            </Alert>
          )}

          {/* Botão de Envio */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email}
            sx={{
              mt: 2,
              mb: 3,
              py: 1.2,
              backgroundColor: '#e0e0e0', // Mantendo o estilo da tela de login
              color: 'black',
              '&:hover': {
                backgroundColor: '#d5d5d5',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Link'}
          </Button>
          
          {/* Link para Voltar ao Login */}
          <Typography variant="body2" align="center">
            Lembrou da sua senha?{' '}
            <Link 
              href="#" 
              onClick={handleGoBack} 
              variant="body2" 
              sx={{ fontWeight: 'bold' }}
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