
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton,
  Breadcrumbs, Link
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, Add, Edit, Delete, NavigateNext // <-- Icone para o Breadcrumb
} from '@mui/icons-material';

const yellowButtonSx = {
  bgcolor: '#FACC15',
  color: '#1F2937',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#EAB308',
  },
};

const grayButtonSx = {
  bgcolor: '#6B7280',
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#4B5563',
  },
};

const mockUserAdmin = {
  nome: "Kelton Martins",
  matricula: "123456",
  email: "kelton@admin.com",
  role: "ADMINISTRADOR"
};

const mockUserFuncionario = {
  nome: "Julio Mateus Morais",
  matricula: "654321",
  email: "julio@funcionario.com",
  role: "FUNCIONARIO"
};

const mockFuncionarios = [
  { id: 1, nome: "Julio Mateus Morais", matricula: "123456", email: "julio@email.com" },
  { id: 2, nome: "Pablo", matricula: "147897", email: "pablo@email.com" },
  { id: 3, nome: "Guilherme pinheiro", matricula: "123783", email: "gui@email.com" },
  { id: 4, nome: "Victor", matricula: "192845", email: "victor@email.com" },
  { id: 5, nome: "Oliveira", matricula: "172839", email: "oliveira@email.com" },
];

function AdminArea({ funcionarios, onAddUser, onEditUser, onDeleteUser }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>Área do Administrador</Typography>
      <Button
        variant="contained"
        endIcon={<Add />}
        sx={{ ...yellowButtonSx, mb: 3 }}
        onClick={onAddUser}
      >
        Cadastrar Novos Usuários
      </Button>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.matricula}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditUser(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDeleteUser(user)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={funcionarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por pág:"
        />
      </TableContainer>
    </Box>
  );
}

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

function LegacyConfigPage() {
  const [funcionarios, setFuncionarios] = React.useState(mockFuncionarios);
  const [openSenha, setOpenSenha] = React.useState(false);

  const handleAddUser = () => {
    // placeholder: open dialog / navigate to a create user form
    const nextId = funcionarios.length ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    setFuncionarios([...funcionarios, { id: nextId, nome: `Novo Usuário ${nextId}`, matricula: String(100000 + nextId), email: `usuario${nextId}@exemplo.com` }]);
  };

  const handleEditUser = (user) => {
    // placeholder: simple name edit for demo
    setFuncionarios(funcionarios.map(f => f.id === user.id ? { ...f, nome: f.nome + ' (edit)' } : f));
  };

  const handleDeleteUser = (user) => {
    setFuncionarios(funcionarios.filter(f => f.id !== user.id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="#/">
          Início
        </Link>
        <Typography color="text.primary">Configurações</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <PersonOutline fontSize="large" />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold">Usuário</Typography>
            <Typography variant="body2" color="text.secondary">{mockUserAdmin.nome} — {mockUserAdmin.role}</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" sx={grayButtonSx} onClick={() => setOpenSenha(true)}>Alterar Senha</Button>
          </Grid>
        </Grid>
      </Paper>

      <AdminArea
        funcionarios={funcionarios}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <AlterarSenhaModal open={openSenha} onClose={() => setOpenSenha(false)} />
    </Box>
  );
}

function AlterarEmailModal({ open, onClose }) {
  const [step, setStep] = useState(1); // 1: Senha, 2: Código, 3: Sucesso

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
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold">Cadastrar Novo Usuário</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField autoFocus label="Nome" fullWidth variant="outlined" />
        <TextField label="E-mail" type="email" fullWidth variant="outlined" />
        <TextField label="Matrícula" fullWidth variant="outlined" />
        <TextField label="Senha Provisória" type="password" fullWidth variant="outlined" />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained" sx={yellowButtonSx}>
          Cadastrar
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
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {React.cloneElement(icon, { sx: { fontSize: 28, color: 'text.secondary' } })}
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="body1" fontWeight="bold">{value}</Typography>
      </Box>
    </Box>
  );
}

export default function ConfigPage() {
  
  const [user, setUser] = useState(mockUserAdmin);
  const [funcionarios, setFuncionarios] = useState(mockFuncionarios);

  const [modalOpen, setModalOpen] = useState(null); // 'senha', 'email', 'cadastrar', 'editar', 'excluir'
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (modalName, user = null) => {
    setSelectedUser(user);
    setModalOpen(modalName);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };

  return (
    
    <Box sx={{ p: 0 }}> 
  
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        aria-label="breadcrumb" 
        sx={{ mb: 2 }}
      >
        <Link underline="hover" color="inherit" href="/">
          Corpo em Forma Gestão
        </Link>
        <Typography color="text.primary">Configurações</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Página de Configurações
      </Typography>

      {/* --- SEÇÃO ACESSO --- */}
      <Typography variant="h4" fontWeight="bold" mb={3}>Acesso</Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} />
        <InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} />
        <InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} />
      </Paper>

      <Grid container spacing={4} mt={1}>
        {/* --- SEÇÃO SEGURANÇA --- */}
        <Grid item xs={12} md={user.role === 'ADMINISTRADOR' ? 5 : 12}>
          <Typography variant="h4" fontWeight="bold" mb={3}>Segurança</Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleOpenModal('senha')}
              endIcon={
                <Box sx={{ bgcolor: '#FACC15', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} />
                </Box>
              }
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-around', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold" }}
            >
              Alterar Senha
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleOpenModal('email')}
              endIcon={
                <Box sx={{ bgcolor: '#FACC15', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} />
                </Box>
              }
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-around', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold" }}
            >
              Alterar Email
            </Button>
          </Paper>
        </Grid>

        {/* --- SEÇÃO ÁREA DO ADMINISTRADOR (CONDICIONAL) --- */}
        {user.role === 'ADMINISTRADOR' && (
          <Grid item xs={12} md={7}>
            <AdminArea
              funcionarios={funcionarios}
              onAddUser={() => handleOpenModal('cadastrar')}
              onEditUser={(user) => handleOpenModal('editar', user)}
              onDeleteUser={(user) => handleOpenModal('excluir', user)}
            />
          </Grid>
        )}
      </Grid>

      {/* --- RENDERIZAÇÃO DOS MODAIS --- */}
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
        // onSave={...}
      />
      <EditarUsuarioModal
        open={modalOpen === 'editar'}
        onClose={handleCloseModal}
        user={selectedUser}
        // onSave={...}
      />
      <ExcluirUsuarioModal
        open={modalOpen === 'excluir'}
        onClose={handleCloseModal}
        user={selectedUser}
        // onConfirm={...}
      />
    </Box>
  );
}