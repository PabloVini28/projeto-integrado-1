import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box
} from '@mui/material';

// IMPORTAÇÃO DA VERIFICAÇÃO (Ajuste o caminho se necessário)
import UserVerification from '../../../authentication/UserVerification'; 

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
const isValidCPFFormat = (cpf) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
const formatCPF = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value.substring(0, 14);
};

export default function CadastrarNovoUsuarioDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', role: 'FUNCIONARIO'
  });
  
  const [openVerification, setOpenVerification] = useState(false);
  const [error, setError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', role: 'FUNCIONARIO' });
      setError(false);
      setFieldErrors({});
      setErrorMessage("");
      setOpenVerification(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'cpf') newValue = formatCPF(value);
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCadastrar = () => {
    const { nome, email, senha, confirmarSenha, cpf } = formData;
    let errors = {};

    const hasEmpty = !nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim() || !cpf.trim();

    if (hasEmpty) {
      if (!nome.trim()) errors.nome = true;
      if (!email.trim()) errors.email = true;
      if (!senha.trim()) errors.senha = true;
      if (!confirmarSenha.trim()) errors.confirmarSenha = true;
      if (!cpf.trim()) errors.cpf = true;

      setFieldErrors(errors);
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setError(true);
      return;
    }

    const specificErrors = {};
    if (!isValidEmail(email)) specificErrors.email = "Formato de e-mail inválido.";
    if (!isValidCPFFormat(cpf)) specificErrors.cpf = "Formato de CPF inválido.";
    const senhaMismatch = (senha !== confirmarSenha);
    if (senhaMismatch) {
      specificErrors.senha = "As senhas não coincidem.";
      specificErrors.confirmarSenha = "As senhas não coincidem.";
    }

    const countLogicalErrors = (specificErrors.email ? 1 : 0) + (specificErrors.cpf ? 1 : 0) + (senhaMismatch ? 1 : 0);

    if (countLogicalErrors > 0) {
      setFieldErrors(specificErrors);
      setErrorMessage("Corrija os campos em erro.");
      setError(true);
      return;
    }

    setError(false);
    setFieldErrors({});
    setErrorMessage("");
    // Se a validação passar, abre a verificação
    setOpenVerification(true);
  };

  const handleVerificationSuccess = () => {
    onSave(formData);
    setOpenVerification(false);
    onClose();
  };

  const resetFieldError = (name) => {
    setError(false);
    setFieldErrors(prev => ({ ...prev, [name]: false }));
    setErrorMessage("");
  };

  const hasSpecificError = error && !errorMessage.includes("preencha todos");
  const isMultipleSpecificErrors = hasSpecificError && !errorMessage.includes("As senhas") && !errorMessage.includes("Formato") && !errorMessage.includes("CPF");
  const showHelperText = isMultipleSpecificErrors;

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '500px' } }}>
        <DialogTitle fontWeight="bold" textAlign="center">Cadastrar um novo Usuário</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {error && <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">{errorMessage}</Typography>}
          
          <TextField 
            autoFocus label="Nome Completo*" name="nome" value={formData.nome}
            onChange={(e) => { handleChange(e); resetFieldError('nome'); }}
            error={!!fieldErrors.nome} 
            helperText={showHelperText && fieldErrors.nome ? fieldErrors.nome : ""}
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.nome && errorTextFieldStyle) }}
          />

          {/* Container do Email com Botão de Teste (Pode remover o botão depois) */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField 
              label="E-mail*" type="email" name="email" value={formData.email}
              onChange={(e) => { handleChange(e); resetFieldError('email'); }}
              error={!!fieldErrors.email} 
              helperText={showHelperText && fieldErrors.email ? fieldErrors.email : ""}
              sx={{ flex: 1, ...blackFocusedTextFieldStyle, ...(fieldErrors.email && errorTextFieldStyle) }}
            />
            {/* Botão de teste para abrir verificação direto */}
            {/* <Button variant="outlined" size="small" onClick={() => setOpenVerification(true)} sx={{ height: '40px', mt: '2px', borderColor: 'black', color: 'black' }}>Testar Verificação</Button> */}
          </Box>

          <TextField 
            label="Senha*" type="password" name="senha" value={formData.senha}
            onChange={(e) => { handleChange(e); resetFieldError('senha'); resetFieldError('confirmarSenha'); }}
            error={!!fieldErrors.senha} 
            helperText={showHelperText && fieldErrors.senha ? fieldErrors.senha : ""}
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.senha && errorTextFieldStyle) }}
          />
          <TextField 
            label="Confirmar Senha*" type="password" name="confirmarSenha" value={formData.confirmarSenha}
            onChange={(e) => { handleChange(e); resetFieldError('senha'); resetFieldError('confirmarSenha'); }}
            error={!!fieldErrors.confirmarSenha} 
            helperText={showHelperText && fieldErrors.confirmarSenha ? fieldErrors.confirmarSenha : ""}
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.confirmarSenha && errorTextFieldStyle) }}
          />
          <TextField 
            label="CPF*" name="cpf" value={formData.cpf}
            onChange={(e) => { handleChange(e); resetFieldError('cpf'); }}
            inputProps={{ maxLength: 14 }} error={!!fieldErrors.cpf}
            helperText={showHelperText && fieldErrors.cpf ? fieldErrors.cpf : ""}
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.cpf && errorTextFieldStyle) }}
          />
        </DialogContent>
        <FormControl component="fieldset" sx={{ mt: 1, pl: 3 }}>
          <FormLabel sx={{ color: '#23272b', '&.Mui-focused': { color: '#23272b' } }} component="legend">Nível de Acesso:</FormLabel>
          <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
            <FormControlLabel value="ADMINISTRADOR" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Administrador" />
            <FormControlLabel value="FUNCIONARIO" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Funcionário" />
          </RadioGroup>
        </FormControl>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={onClose} variant="contained" sx={grayButtonSx}>CANCELAR</Button>
          <Button onClick={handleCadastrar} variant="contained" sx={yellowButtonSx}>CADASTRAR USUÁRIO</Button>
        </DialogActions>
      </Dialog>

      {/* DIÁLOGO DA VERIFICAÇÃO */}
      <Dialog
        open={openVerification}
        onClose={() => setOpenVerification(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 8, padding: 2 } }}
      >
        <DialogContent sx={{ p: 0 }}>
            {UserVerification ? (
                <UserVerification 
                    onVerificationSuccess={handleVerificationSuccess}
                    onClose={() => setOpenVerification(false)}
                />
            ) : (
                <Typography sx={{p:4, color: 'red'}}>Erro: Componente UserVerification não encontrado.</Typography>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}