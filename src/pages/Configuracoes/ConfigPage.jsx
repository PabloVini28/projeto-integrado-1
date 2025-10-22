
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