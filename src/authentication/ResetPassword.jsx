import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, CircularProgress, Alert
} from '@mui/material';
import logoImage from '../assets/logo/icon.png';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !code || !newPassword) return;

    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      
      setStatus({ message: 'Senha alterada com sucesso!', type: 'success' });
      
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao redefinir senha.';
      setStatus({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" sx={{ maxWidth: '340px !important', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box component="img" src={logoImage} sx={{ width: 60, mb: 1 }} />
        
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>Redefinir Senha</Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          
          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} 
          />
          
          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            label="Código de Verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            type="password"
            label="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />

          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2 }}>{status.message}</Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.2, backgroundColor: '#F2D95C', color: 'black', '&:hover': { backgroundColor: '#E0C84D' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Alterar Senha'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;