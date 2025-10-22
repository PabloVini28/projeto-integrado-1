
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
        startIcon={<Add />}
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
          labelRowsPerPage="Rows per page:"
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

export default function ConfigPage() {
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