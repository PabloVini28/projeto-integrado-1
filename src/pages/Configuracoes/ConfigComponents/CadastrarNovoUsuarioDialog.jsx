import React, { useState, useEffect } from 'react';
import {
  Typography, Button, DialogContent,
  DialogActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box
} from '@mui/material';

import UserVerification from '../../../authentication/UserVerification'; 
import { ModalBase } from "../../../components/ModalBase";

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
  const [creating, setCreating] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

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
    
    if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: false }));
        if (Object.keys(fieldErrors).length <= 1) {
            setError(false);
            setErrorMessage("");
        }
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCadastrar = async () => {
      const { nome, email, senha, confirmarSenha, cpf } = formData;
      let errors = {};

      if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim() || !cpf.trim()) {
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
      if (senha !== confirmarSenha) {
        specificErrors.senha = "As senhas não coincidem.";
        specificErrors.confirmarSenha = "As senhas não coincidem.";
      }
      if (senha.length < 6) {
          specificErrors.senha = "A senha deve ter no mínimo 6 dígitos.";
      }

      if (Object.keys(specificErrors).length > 0) {
        setFieldErrors(specificErrors);
        setErrorMessage("Corrija os campos em erro.");
        setError(true);
        return;
      }

      try {
        setCreating(true);
        const created = await onSave(formData);
        if (created) {
          setCreatedUser(created);
          setOpenVerification(true);
        } else {
          setError(true);
          setErrorMessage('Erro ao cadastrar usuário.');
        }
      } catch (err) {
        setError(true);
        setErrorMessage(err.message || 'Erro ao cadastrar usuário.');
      } finally {
        setCreating(false);
      }
  };

  const handleVerificationSuccess = () => {
    setOpenVerification(false);
    onClose();
  };

  return (
    <>
      <ModalBase open={open} onClose={onClose} title="Cadastrar um novo Usuário">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          {error && <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">{errorMessage}</Typography>}
          
          <TextField 
            autoFocus label="Nome Completo*" name="nome" value={formData.nome}
            onChange={handleChange}
            error={!!fieldErrors.nome} 
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.nome && errorTextFieldStyle) }}
          />
          <TextField 
            label="E-mail*" type="email" name="email" value={formData.email}
            onChange={handleChange}
            error={!!fieldErrors.email} 
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.email && errorTextFieldStyle) }}
          />
          <TextField 
            label="Senha*" type="password" name="senha" value={formData.senha}
            onChange={handleChange}
            error={!!fieldErrors.senha} 
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.senha && errorTextFieldStyle) }}
          />
          <TextField 
            label="Confirmar Senha*" type="password" name="confirmarSenha" value={formData.confirmarSenha}
            onChange={handleChange}
            error={!!fieldErrors.confirmarSenha} 
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.confirmarSenha && errorTextFieldStyle) }}
          />
          <TextField 
            label="CPF*" name="cpf" value={formData.cpf}
            onChange={handleChange}
            inputProps={{ maxLength: 14 }} error={!!fieldErrors.cpf}
            sx={{ ...blackFocusedTextFieldStyle, ...(fieldErrors.cpf && errorTextFieldStyle) }}
          />

          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <FormLabel sx={{ color: '#23272b', '&.Mui-focused': { color: '#23272b' }, fontSize: '0.9rem' }} component="legend">Nível de Acesso:</FormLabel>
            <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
              <FormControlLabel value="ADMINISTRADOR" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Administrador" />
              <FormControlLabel value="FUNCIONARIO" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Funcionário" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ p: '16px 24px', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={onClose} variant="contained" sx={grayButtonSx}>CANCELAR</Button>
          <Button onClick={handleCadastrar} variant="contained" sx={yellowButtonSx} disabled={creating}>
            {creating ? 'Criando...' : 'CADASTRAR USUÁRIO'}
          </Button>
        </DialogActions>
      </ModalBase>

      <ModalBase 
        open={openVerification} 
        onClose={() => setOpenVerification(false)}
        title="Verificação de Usuário"
      >
        <DialogContent sx={{ p: 0 }}>
            {UserVerification ? (
            <UserVerification 
              cpf={createdUser && createdUser.cpf_funcionario}
              onVerificationSuccess={handleVerificationSuccess}
              onClose={() => setOpenVerification(false)}
            />
            ) : (
              <Typography sx={{p:4, color: 'red'}}>Erro: Componente de verificação não encontrado.</Typography>
            )}
        </DialogContent>
      </ModalBase>
    </>
  );
}