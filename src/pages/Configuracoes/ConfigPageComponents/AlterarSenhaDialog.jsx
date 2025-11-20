import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: 'black',
  fontWeight: 'normal',
  '&:hover': {
    bgcolor: '#e0c850',
  },
  textTransform: 'none',
};

const grayButtonSx = {
  bgcolor: '#343a40',
  color: 'white',
  fontWeight: 'normal',
  '&:hover': {
    bgcolor: '#23272b',
  },
  textTransform: 'none',
};

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

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function AlterarSenhaDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSendLink = () => {
    setFieldErrors({});
    setErrorMessage('');
    
    if (!email.trim()) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setError(true);
      setFieldErrors({email: true});
      return;
    }
    
    let errors = {};
    let message = "";

    if (!isValidEmail(email)) {
        errors.email = "Formato de e-mail inválido.";
    } else if (email.toLowerCase() === 'invalido@email.com') {
      errors.email = "E-mail não encontrado. Verifique se o e-mail está correto.";
    }

    const errorCount = Object.keys(errors).length;
    
    if (errorCount > 0) {
      if (errorCount === 1) {
          message = Object.values(errors)[0];
      } else {
          message = "Corrija os campos em erro.";
      }
      setError(true);
      setFieldErrors(errors);
      setErrorMessage(message);
      return;
    }

    setErrorMessage('');
    setError(false);
    setFieldErrors({});
    console.log("Link de redefinição enviado para:", email);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setEmail('');
      setError(false);
      setErrorMessage('');
      setFieldErrors({});
    }
  }, [open]);

  const hasSpecificError = error && !errorMessage.includes("preencha todos");
  const showHelperText = hasSpecificError && Object.keys(fieldErrors).length > 1;

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold" textAlign="center">Alterar Senha</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
          Informe seu e-mail para um link de redefinição.
        </Typography>
        {error && (
          <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">
            {errorMessage}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="E-mail*"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(false); setFieldErrors({}); setErrorMessage(''); }}
          error={!!fieldErrors.email}
          helperText={showHelperText && fieldErrors.email ? fieldErrors.email : ""}
          sx={{...blackFocusedTextFieldStyle, ...(fieldErrors.email && errorTextFieldStyle)}}
        />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>
          CANCELAR
        </Button>
        <Button onClick={handleSendLink} variant="contained" sx={yellowButtonSx}>
          ENVIAR LINK
        </Button>
      </DialogActions>
    </Dialog>
  );
}