import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton,
  Breadcrumbs, Link, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Fab
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, Add, Edit, Delete, NavigateNext
} from '@mui/icons-material';

const yellowButtonSx = {
  backgroundColor: '#F2D95C',
  color: 'black',
  '&:hover': { backgroundColor: '#e0c850' },
  fontWeight: 'normal',
};

const grayButtonSx = {
  backgroundColor: '#343a40',
  color: 'white',
  '&:hover': { backgroundColor: '#23272b' },
  fontWeight: 'normal',
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Área do Administrador</Typography>

      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            sx={{ ...yellowButtonSx, borderRadius: '20px' }}
            onClick={onAddUser}
          >
            CADASTRAR NOVO USUÁRIO
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nível de Acesso</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, idx) => (
                <TableRow
                  key={user.id}
                  sx={(theme) => ({
                    backgroundColor: idx % 2
                      ? theme.palette.action.hover
                      : 'transparent',
                  })}
                >
                  <TableCell>{user.nome ?? '-'}</TableCell>
                  <TableCell>{user.matricula ?? '-'}</TableCell>
                  <TableCell>{user.cpf ?? '-'}</TableCell>
                  <TableCell>{user.role ?? 'FUNCIONARIO'}</TableCell>
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
    
    const nextId = funcionarios.length ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    setFuncionarios([...funcionarios, { id: nextId, nome: `Novo Usuário ${nextId}`, matricula: String(100000 + nextId), email: `usuario${nextId}@exemplo.com` }]);
  };

  const handleEditUser = (user) => {
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

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }} elevation={0}>
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
        <TextField autoFocus label="Nome Completo*" />
        <TextField label="E-mail*" type="email" />
        <TextField label="Senha*" type="password" />
        <TextField label="Confirmar Senha*" type="password" />
        <TextField label="CPF*" />
      </DialogContent>
      <FormControl component="fieldset" sx={{ mt: 1 }}>
        <FormLabel component="legend"
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
            '&.Mui-focused': {
              color: 'rgba(0, 0, 0, 0.6)'
            }
          }}
        >Tipo de Usuário:</FormLabel>
        <RadioGroup
          row
          aria-label="tipo de usuário"
          name="tipo-usuario-group"
          defaultValue="funcionario"
        >
          <FormControlLabel value="administrador" control={<Radio sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Administrador" />
          <FormControlLabel value="funcionario" control={<Radio sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Funcionário" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx} >
          CANCELAR
        </Button>
        <Button onClick={onSave} variant="contained" sx={yellowButtonSx}>
          CADASTRAR USUÁRIO
        </Button>
      </Box>
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

  return (

    <Box sx={{ p: 4 }}>

      <Typography variant="h4" fontWeight="bold" mb={4}>
        Configurações
      </Typography>

      <Typography variant="h5" mb={3}>Acesso</Typography>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} />
        <InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} />
        <InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} />
      </Paper>

      <Box mb={3} mt={3}>
        <Typography variant="h5" mb={3} marginTop={7} marginBottom={7}>Segurança</Typography>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
            <Button
              variant="contained"
              onClick={() => handleOpenModal('senha')}
              endIcon={
                <Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight sx={{ color: '#1F2937', fontSize: 20, }} />
                </Box>
              }
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight: "bold" }}
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
              sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight: "bold" }}
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
      />
      <EditarUsuarioModal
        open={modalOpen === 'editar'}
        onClose={handleCloseModal}
        user={selectedUser}
      />
      <ExcluirUsuarioModal
        open={modalOpen === 'excluir'}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </Box>
  );
}