import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton,
  Breadcrumbs, Link, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,Fab
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, Add, Edit, Delete, NavigateNext
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

const mockUserAdmin = {
  id: 5,
  nome: "Kelton Martins",
  matricula: "123456",
  cpf: "123.456.789-00",
  email: "kelton@admin.com",
  role: "ADMINISTRADOR"
};

const mockUserFuncionario = {
  nome: "Julio Mateus Morais",
  matricula: "654321",
  cpf: "987.654.321-00",
  email: "julio@funcionario.com",
  role: "FUNCIONARIO"
};

const mockFuncionarios = [
  { id: 1, nome: "Julio Mateus Morais", cpf: "156.476.239-00", matricula: "123456", email: "julio@email.com", role: 'FUNCIONARIO' },
  { id: 2, nome: "Pablo", cpf: "987.654.321-00", matricula: "147897", email: "pablo@email.com", role: 'FUNCIONARIO' },
  { id: 3, nome: "Guilherme pinheiro", cpf: "123.783.456-00", matricula: "123783", email: "gui@email.com", role: 'FUNCIONARIO' },
  { id: 4, nome: "Victor", cpf: "192.845.678-00", matricula: "192845", email: "victor@email.com", role: 'FUNCIONARIO' },
  mockUserAdmin
];


function AlterarSenhaModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Alterar Senha</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Informe seu e-mail para um link de redefinição.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="E-mail"
          type="email"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Cancelar</Button>
        <Button onClick={onClose} variant="contained" sx={yellowButtonSx}>
          Enviar Link
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function AlterarEmailModal({ open, onClose }) {
  const [step, setStep] = useState(1); 

  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep(1), 300);
    }
  }, [open]);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);
  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogTitle fontWeight="bold">Alterar E-mail</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Digite a senha do app"
                type="password"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Digite seu novo email"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handleClose} variant="contained" sx={grayButtonSx}>
                Cancelar
              </Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>
                Continuar
              </Button>
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
                Por favor, digite-o abaixo.
              </Typography>
              <CodigoInput />
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
              <Button onClick={handlePrevStep} variant="contained" sx={grayButtonSx}>
                Cancelar
              </Button>
              <Button onClick={handleNextStep} variant="contained" sx={yellowButtonSx}>
                Continuar
              </Button>
            </DialogActions>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle fontWeight="bold">Sucesso E-mail</DialogTitle>
            <DialogContent>
              <Typography variant="body1" textAlign="center">
                Parabéns! Seu e-mail foi alterado com sucesso.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px', justifyContent: 'center' }}>
              <Button onClick={handleClose} variant="contained" sx={yellowButtonSx}>
                Concluído
              </Button>
            </DialogActions>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '450px' } }}>
      {renderStep()}
    </Dialog>
  );
}

function CadastrarUsuarioModal({ open, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '500px' } }}>
      <DialogTitle fontWeight="bold" textAlign="center" >Cadastrar um novo Usuário</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField autoFocus label="Nome Completo*"/>
        <TextField label="E-mail*" type="email" />
        <TextField label="Senha*" type="password" />
        <TextField label="Confirmar Senha*" type="password"  />
        <TextField label="CPF*"/>
      </DialogContent>
      <FormControl component="fieldset" sx={{ mt: 1, pl: 3 }}> 
          <FormLabel component="legend">Tipo de Usuário:</FormLabel>
          <RadioGroup
            row
            aria-label="tipo de usuário"
            name="tipo-usuario-group"
            defaultValue="funcionario"
          >
            <FormControlLabel value="administrador" control={<Radio />} label="Administrador" />
            <FormControlLabel value="funcionario" control={<Radio />} label="Funcionário" />
          </RadioGroup>
      </FormControl>
      <DialogActions sx={{ p: 3, justifyContent: 'flex-start', gap: 1.5 }}>
          <Button onClick={onClose} variant="contained" sx={grayButtonSx} >
            Cancelar
          </Button>
          <Button onClick={onSave} variant="contained" sx={yellowButtonSx}>
            Cadastrar Usuário
          </Button>
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
    } else {
      setNome('');
      setEmail('');
    }
  }, [user, open]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Editar Usuário</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField
          autoFocus
          label="Nome"
          fullWidth
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained" sx={yellowButtonSx}>
          Salvar Usuário
        </Button>
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
          Tem certeza que deseja excluir o usuário <strong>{user?.nome}</strong>?
          Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>
          Voltar
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={yellowButtonSx}>
          Excluir
        </Button>
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
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '1.2rem', padding: 10 },
          }}
        />
      ))}
    </Box>
  );
}

function InfoItem({ icon, title, value }) {
  const capitalizeRole = (val) => {
    if (typeof val === 'string' && (val === 'ADMINISTRADOR' || val === 'FUNCIONARIO')) {
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
  
  const [user, setUser] = useState(mockUserAdmin);
  const [funcionarios, setFuncionarios] = useState(mockFuncionarios);

  const [modalOpen, setModalOpen] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (modalName, user = null) => {
    setSelectedUser(user);
    setModalOpen(modalName);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };

  const handleAddUser = (userData) => {
    console.log("Adicionando usuário:", userData);
    handleCloseModal();
  };

  const handleEditUser = (userData) => {
    console.log("Editando usuário:", userData);
    handleCloseModal();
  };
  
  const handleDeleteUser = () => {
    console.log("Excluindo usuário:", selectedUser);
    setFuncionarios(funcionarios.filter(f => f.id !== selectedUser.id));
    handleCloseModal();
  };


  return (
    
    <Box sx={{ p: 4 }}> 
      
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Configurações
      </Typography>

      <Typography variant="h5"  mb={2}>Acesso</Typography>
      <Paper 
        variant="outlined" 
        sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
      >
        <InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} />
        <InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} />
        <InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} />
      </Paper>

      <Box mb={3} mt={5}> 
        <Typography variant="h5" mb={2}>Segurança</Typography> 
        <Paper 
            variant="outlined" 
            sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2}}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
            <Button
              variant="contained"
              onClick={() => handleOpenModal('senha')}
              endIcon={
                <Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight sx={{ color: '#1F2937', fontSize: 20,  }} />
                </Box>
              }
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}
            >
              Alterar Senha
            </Button>
            <Button
              variant="contained"
              onClick={() => handleOpenModal('email')}
              endIcon={
                <Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} />
                </Box>
              }
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}
            >
              Alterar Email
            </Button>
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

      <AlterarSenhaModal
        open={modalOpen === 'senha'}
        onClose={handleCloseModal}
      />
      <AlterarEmailModal
        open={modalOpen === 'email'}
        onClose={handleCloseModal}
      />
      <CadastrarUsuarioModal
        open={modalOpen === 'cadastrar'}
        onClose={handleCloseModal}
        onSave={handleAddUser}
      />
      <EditarUsuarioModal
        open={modalOpen === 'editar'}
        onClose={handleCloseModal}
        user={selectedUser}
        onSave={handleEditUser}
      />
      <ExcluirUsuarioModal
        open={modalOpen === 'excluir'}
        onClose={handleCloseModal}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </Box>
  );
}