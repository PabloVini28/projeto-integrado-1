import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: 'black',
  fontWeight: 'normal',
  '&:hover': { bgcolor: '#e0c850' },
  textTransform: 'none',
};

const grayButtonSx = {
  bgcolor: '#343a40',
  color: 'white',
  fontWeight: 'normal',
  '&:hover': { bgcolor: '#23272b' },
  textTransform: 'none',
};

const blackFocusedTextFieldStyle = {
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#343a40' },
};

const errorTextFieldStyle = {
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'red !important' },
    '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'darkred !important' },
    '& .MuiInputLabel-root.Mui-error': { color: 'red !important' },
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function CodigoInput({ code, setCode, isError, setError }) {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(-1);
    if (/[0-9]/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value !== '' && index < 5) inputRefs.current[index + 1]?.focus();
      setError(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', my: 3 }}>
      {[...Array(6)].map((_, index) => (
        <TextField
          key={index}
          variant="outlined"
          sx={{ width: 45, height: 45, ...blackFocusedTextFieldStyle, ...(isError && errorTextFieldStyle) }}
          inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.2rem', padding: 10 } }}
          value={code[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          error={isError}
          inputRef={el => inputRefs.current[index] = el}
        />
      ))}
    </Box>
  );
}

export default function AlterarEmailDialog({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step1FieldErrors, setStep1FieldErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep(1), 300);
      setPassword('');
      setNewEmail('');
      setCode(['', '', '', '', '', '']);
      setError(false);
      setErrorMessage('');
      setStep1FieldErrors({});
    }
  }, [open]);

  const handleNextStep = () => {
    setError(false);
    setErrorMessage('');
    setStep1FieldErrors({});

    if (step === 1) {
      const hasEmpty = !password.trim() || !newEmail.trim();
      if (hasEmpty) {
        const errors = {};
        if (!password.trim()) errors.password = true;
        if (!newEmail.trim()) errors.newEmail = true;
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
        setError(true);
        setStep1FieldErrors(errors);
        return;
      }
      
      let errors = {};
      if (!isValidEmail(newEmail)) errors.newEmail = "Formato de e-mail inválido.";
      if (!password) errors.password = "Senha atual obrigatória.";

      const errorCount = Object.keys(errors).length;
      if (errorCount > 0) {
        let message = errorCount === 1 ? Object.values(errors)[0] : "Corrija os campos em erro.";
        setError(true);
        setStep1FieldErrors(errors);
        setErrorMessage(message);
        return;
      }

      (async () => {
        try {
          const token = localStorage.getItem('authToken');
          const userDataString = localStorage.getItem('userData');
          if (!userDataString) throw new Error('Sessão inválida. Faça login novamente.');
          const userData = JSON.parse(userDataString);
          const id = userData.id_funcionario || userData.id;

          const resp = await fetch('http://localhost:4000/api/funcionario/email/change/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ id, currentPassword: password, newEmail }),
          });

          if (resp.ok) {
            setStep(2);
          } else {
            const data = await resp.json().catch(() => ({}));
            setError(true);
            setErrorMessage(data.error || 'Falha ao iniciar alteração de email.');
            if (data.error && data.error.toLowerCase().includes('senha')) {
              setStep1FieldErrors({ password: true });
            }
          }
        } catch (err) {
          console.error(err);
          setError(true);
          setErrorMessage(err.message || 'Erro de conexão.');
        }
      })();

    } else if (step === 2) {
      const enteredCode = code.join('');
      if (enteredCode.length < 6) {
        setErrorMessage("Por favor, preencha o código de 6 dígitos.");
        setError(true);
        return;
      }
      (async () => {
        try {
          const token = localStorage.getItem('authToken');
          const userDataString = localStorage.getItem('userData');
          if (!userDataString) throw new Error('Sessão inválida. Faça login novamente.');
          const userData = JSON.parse(userDataString);
          const id = userData.id_funcionario || userData.id;

          const resp = await fetch('http://localhost:4000/api/funcionario/email/change/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ id, code: enteredCode }),
          });

          if (resp.ok) {
            setStep(3);
            if (typeof onSuccess === 'function') onSuccess();
          } else {
            const data = await resp.json().catch(() => ({}));
            setError(true);
            setErrorMessage(data.error || 'Código de verificação incorreto.');
          }
        } catch (err) {
          console.error(err);
          setError(true);
          setErrorMessage(err.message || 'Erro de conexão.');
        }
      })();
    }
  };

  const handlePrevStep = () => {
    setError(false);
    setErrorMessage('');
    setStep1FieldErrors({});
    setStep((prev) => prev - 1);
  };
  
  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const renderStep = () => {
    const hasEmptyError = error && errorMessage.includes("preencha todos");
    const hasSpecificError = error && !hasEmptyError;
    const showHelperText = hasSpecificError && Object.keys(step1FieldErrors).length > 1;

    switch (step) {
      case 1:
        const isPasswordError = !!step1FieldErrors.password;
        const isNewEmailError = !!step1FieldErrors.newEmail;
        return (
          <>
            <DialogTitle fontWeight="bold" textAlign="center">Alterar E-mail</DialogTitle>
            <DialogContent>
              {error && <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">{errorMessage}</Typography>}
              <TextField autoFocus margin="dense" label="Digite a senha do app*" type="password" fullWidth variant="outlined" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} error={isPasswordError} helperText={showHelperText && isPasswordError ? step1FieldErrors.password : ""} sx={{...blackFocusedTextFieldStyle, ...(isPasswordError ? errorTextFieldStyle : {})}} />
              <TextField margin="dense" label="Digite seu novo email*" type="email" fullWidth variant="outlined" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setError(false); }} error={isNewEmailError} helperText={showHelperText && isNewEmailError ? step1FieldErrors.newEmail : ""} sx={{...blackFocusedTextFieldStyle, ...(isNewEmailError ? errorTextFieldStyle : {})}} />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handleClose} variant="contained" sx={grayButtonSx}>CANCELAR</Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>CONTINUAR</Button>
            </DialogActions>
          </>
        );
      case 2:
        return (
          <>
            <DialogTitle fontWeight="bold" textAlign="center">Verificar E-mail</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" textAlign="center">Um código de 6 dígitos foi enviado para seu e-mail.</Typography>
              {error && <Typography color="error" variant="body2" mt={2} textAlign="center" fontWeight="bold">{errorMessage}</Typography>}
              <CodigoInput code={code} setCode={setCode} isError={error} setError={setError} />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handlePrevStep} variant="contained" sx={grayButtonSx}>VOLTAR</Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>CONTINUAR</Button>
            </DialogActions>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle fontWeight="bold" textAlign="center">Sucesso</DialogTitle>
            <DialogContent>
              <Typography variant="body1" textAlign="center">Parabéns! Seu e-mail foi alterado com sucesso.</Typography>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px', justifyContent: 'center' }}>
              <Button onClick={handleClose} variant="contained" sx={yellowButtonSx}>CONCLUÍDO</Button>
            </DialogActions>
          </>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      {renderStep()}
    </Dialog>
  );
}