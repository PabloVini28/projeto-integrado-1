import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, BadgeOutlined, MailOutline 
} from '@mui/icons-material';

import AdminArea from './ConfigComponents/AdminArea';

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: '#1F2937',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#EAB308',
  },
  textTransform: 'none', 
};

const grayButtonSx = {
  bgcolor: '#6B7280',
  color: '#F2D95C',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#4B5563',
  },
  textTransform: 'none', 
};

function AlterarSenhaModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Alterar Senha</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Informe seu e-mail para um link de redefinição.
        </Typography>
        <TextField autoFocus margin="dense" label="E-mail" type="email" fullWidth variant="outlined" />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={onClose} variant="contained" sx={yellowButtonSx}>Enviar Link</Button>
      </DialogActions>
    </Dialog>
  );
}

function AlterarEmailModal({ open, onClose }) {
  const [step, setStep] = useState(1); 
  useEffect(() => { if (!open) setTimeout(() => setStep(1), 300); }, [open]);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);
  const handleClose = () => { setStep(1); onClose(); };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogTitle fontWeight="bold">Alterar E-mail</DialogTitle>
            <DialogContent>
              <TextField autoFocus margin="dense" label="Digite a senha do app" type="password" fullWidth variant="outlined" />
              <TextField margin="dense" label="Digite seu novo email" type="email" fullWidth variant="outlined" />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handleClose} variant="contained" sx={grayButtonSx}>Cancelar</Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>Continuar</Button>
            </DialogActions>
          </>
        );
      case 2:
        return (
          <>
            <DialogTitle fontWeight="bold">Código E-mail</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Um código de 6 dígitos foi enviado para seu e-mail.
              </Typography>
              <CodigoInput />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handlePrevStep} variant="contained" sx={grayButtonSx}>Cancelar</Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>Continuar</Button>
            </DialogActions>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle fontWeight="bold">Sucesso E-mail</DialogTitle>
            <DialogContent>
              <Typography variant="body1" textAlign="center">Parabéns! Seu e-mail foi alterado com sucesso.</Typography>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px', justifyContent: 'center' }}>
              <Button onClick={handleClose} variant="contained" sx={yellowButtonSx}>Concluído</Button>
            </DialogActions>
          </>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '450px' } }}>
      {renderStep()}
    </Dialog>
  );
}

function CadastrarUsuarioModal({ open, onClose, onSave }) {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    tipo: 'funcionario'
  });

  useEffect(() => {
    if (open) {
      setDados({ nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', tipo: 'funcionario' });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmar = () => {
    if (dados.senha !== dados.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }
    if (!dados.nome || !dados.email || !dados.senha || !dados.cpf) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    onSave(dados);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '500px' } }}>
      <DialogTitle fontWeight="bold" textAlign="center" >Cadastrar um novo Usuário</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField autoFocus label="Nome Completo*" name="nome" value={dados.nome} onChange={handleChange} />
        <TextField label="E-mail*" type="email" name="email" value={dados.email} onChange={handleChange} />
        <TextField label="Senha*" type="password" name="senha" value={dados.senha} onChange={handleChange} />
        <TextField label="Confirmar Senha*" type="password" name="confirmarSenha" value={dados.confirmarSenha} onChange={handleChange} />
        <TextField label="CPF*" name="cpf" value={dados.cpf} onChange={handleChange} />
      </DialogContent>
      <FormControl component="fieldset" sx={{ mt: 1, pl: 3 }}> 
          <FormLabel component="legend">Tipo de Usuário:</FormLabel>
          <RadioGroup row aria-label="tipo de usuário" name="tipo" value={dados.tipo} onChange={handleChange}>
            <FormControlLabel value="administrador" control={<Radio />} label="Administrador" />
            <FormControlLabel value="funcionario" control={<Radio />} label="Funcionário" />
          </RadioGroup>
      </FormControl>
      <DialogActions sx={{ p: 3, justifyContent: 'flex-start', gap: 1.5 }}>
          <Button onClick={onClose} variant="contained" sx={grayButtonSx} >Cancelar</Button>
          <Button onClick={handleConfirmar} variant="contained" sx={yellowButtonSx}>Cadastrar Usuário</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditarUsuarioModal({ open, onClose, onSave, user }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
    }
  }, [user, open]);

  const handleSalvar = () => {
    onSave({ nome, email });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Editar Usuário</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField autoFocus label="Nome" fullWidth variant="outlined" value={nome} onChange={(e) => setNome(e.target.value)} />
        <TextField label="E-mail" type="email" fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Typography variant="caption" color="text.secondary">
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>Cancelar</Button>
        <Button onClick={handleSalvar} variant="contained" sx={yellowButtonSx}>Salvar Usuário</Button>
      </DialogActions>
    </Dialog>
  );
}

function ExcluirUsuarioModal({ open, onClose, onConfirm, user }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Excluir Usuário</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir o usuário <strong>{user?.nome}</strong>? Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>Voltar</Button>
        <Button onClick={onConfirm} variant="contained" sx={yellowButtonSx}>Excluir</Button>
      </DialogActions>
    </Dialog>
  );
}

function CodigoInput() {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', my: 3 }}>
      {[...Array(6)].map((_, index) => (
        <TextField
          key={index}
          variant="outlined"
          sx={{ width: 45, height: 45 }}
          inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.2rem', padding: 10 } }}
        />
      ))}
    </Box>
  );
}

function InfoItem({ icon, title, value }) {
  const capitalizeRole = (val) => {
    if (typeof val === 'string' && (val.toUpperCase() === 'ADMINISTRADOR' || val.toUpperCase() === 'FUNCIONARIO')) {
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    }
    return val; 
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {React.cloneElement(icon, { sx: { fontSize: 28, color: 'text.secondary' } })}
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="body1" fontWeight="Semi bold">{capitalizeRole(value)}</Typography>
      </Box>
    </Box>
  );
}

export default function ConfigPage() {
  
  const [user, setUser] = useState({
    id: '',
    nome: 'Carregando...',
    matricula: '',
    cpf: '',
    email: '',
    role: ''
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    try {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const parsedUser = JSON.parse(storedData);
            setUser({
                id: parsedUser.id_funcionario,
                nome: parsedUser.nome_funcionario,
                matricula: parsedUser.id_funcionario ? parsedUser.id_funcionario.toString() : '---', 
                cpf: parsedUser.cpf_funcionario,
                email: parsedUser.email_funcionario,
                role: parsedUser.nivel_acesso ? parsedUser.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
            });
        }
    } catch (error) {
        console.error("Erro ao ler dados do usuário:", error);
    }
  }, []);

  useEffect(() => {
    const fetchFuncionarios = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:4000/api/funcionario', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const listaFormatada = data.map(f => ({
                    id: f.id_funcionario,
                    nome: f.nome_funcionario,
                    cpf: f.cpf_funcionario,
                    matricula: f.id_funcionario.toString(),
                    email: f.email_funcionario,
                    role: f.nivel_acesso ? f.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
                }));
                setFuncionarios(listaFormatada);
            }
        } catch (error) {
            console.error("Erro de conexão com a API:", error);
        }
    };

    if (user.role === 'ADMINISTRADOR') {
        fetchFuncionarios();
    }
  }, [user.role]); 

  const handleOpenModal = (modalName, userToEdit = null) => {
    setSelectedUser(userToEdit);
    setModalOpen(modalName);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };

  const handleAddUser = async (userData) => {
    const token = localStorage.getItem('authToken');
    const tempId = Math.floor(Math.random() * 100000);
    const payload = {
        id_funcionario: tempId,
        nome_funcionario: userData.nome,
        email_funcionario: userData.email,
        cpf_funcionario: userData.cpf,
        senha: userData.senha,
        nivel_acesso: userData.tipo === 'administrador' ? 'Administrador' : 'Funcionário'
    };

    try {
        const response = await fetch('http://localhost:4000/api/funcionario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const novo = await response.json();
            const novoTela = {
                id: novo.id_funcionario,
                nome: novo.nome_funcionario,
                cpf: novo.cpf_funcionario,
                matricula: novo.id_funcionario.toString(),
                email: novo.email_funcionario,
                role: novo.nivel_acesso ? novo.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
            };
            setFuncionarios([...funcionarios, novoTela]);
            alert("Usuário cadastrado com sucesso!");
            handleCloseModal();
        } else {
            const err = await response.json();
            alert("Erro ao cadastrar: " + (err.error || response.statusText));
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
  };

  const handleEditUser = async (updatedData) => {
    const token = localStorage.getItem('authToken');
    
    const payload = {
        nome_funcionario: updatedData.nome,
        email_funcionario: updatedData.email
    };

    try {
        const response = await fetch(`http://localhost:4000/api/funcionario/${selectedUser.cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const atualizado = await response.json();
            
            const novaLista = funcionarios.map(f => {
                if (f.id === selectedUser.id) {
                    return {
                        ...f,
                        nome: atualizado.nome_funcionario,
                        email: atualizado.email_funcionario
                    };
                }
                return f;
            });

            setFuncionarios(novaLista);
            alert("Usuário atualizado com sucesso!");
            handleCloseModal();
        } else {
            alert("Erro ao atualizar usuário.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
  };
  
  const handleDeleteUser = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`http://localhost:4000/api/funcionario/${selectedUser.cpf}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            setFuncionarios(funcionarios.filter(f => f.id !== selectedUser.id));
            alert("Usuário removido com sucesso!");
            handleCloseModal();
        } else {
            alert("Erro ao excluir usuário.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
  };

  return (
    <Box sx={{ p: 4 }}> 
      <Typography variant="h4" fontWeight="bold" mb={4}>Configurações</Typography>

      <Typography variant="h5"  mb={2}>Acesso</Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<BadgeOutlined />} title="CPF:" value={user.cpf} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<MailOutline />} title="E-mail:" value={user.email} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} /></Grid>
        </Grid>
      </Paper>

      <Box mb={3} mt={5}> 
        <Typography variant="h5" mb={2}>Segurança</Typography> 
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
            <Button variant="contained" onClick={() => handleOpenModal('senha')} endIcon={<Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight sx={{ color: '#1F2937', fontSize: 20,  }} /></Box>} sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}>Alterar Senha</Button>
            <Button variant="contained" onClick={() => handleOpenModal('email')} endIcon={<Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} /></Box>} sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}>Alterar Email</Button>
          </Box>
        </Paper>
      </Box>

      {user.role === 'ADMINISTRADOR' && (
        <Box>
          <AdminArea
            funcionarios={funcionarios}
            onAddUser={() => handleOpenModal('cadastrar')}
            onEditUser={(user) => handleOpenModal('editar', user)}
            onDeleteUser={(user) => handleOpenModal('excluir', user)}
          />
        </Box>
      )}

      <AlterarSenhaModal open={modalOpen === 'senha'} onClose={handleCloseModal} />
      <AlterarEmailModal open={modalOpen === 'email'} onClose={handleCloseModal} />
      <CadastrarUsuarioModal open={modalOpen === 'cadastrar'} onClose={handleCloseModal} onSave={handleAddUser} />
      <EditarUsuarioModal open={modalOpen === 'editar'} onClose={handleCloseModal} user={selectedUser} onSave={handleEditUser} />
      <ExcluirUsuarioModal open={modalOpen === 'excluir'} onClose={handleCloseModal} user={selectedUser} onConfirm={handleDeleteUser} />
    </Box>
  );
}