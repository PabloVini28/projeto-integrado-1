import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: 'black',
  fontWeight: 'normal',
  '&:hover': { bgcolor: '#e0c850' },
  textTransform: 'none',
};

export default function AdminArea({
  funcionarios = [],
  onAddUser = () => {},
  onEditUser = () => {},
  onDeleteUser = () => {},
  currentUserId = null,
  currentUserRole = null,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatRole = (role) => {
    if (!role) return "-";
    const roleMap = {
      'ADMINISTRADOR': 'Administrador',
      'SUPER_ADMIN': 'Super Admin',
      'FUNCIONARIO': 'Funcionário',
      'FUNCION_RIO': 'Funcionário',
      'FUNCIONÁRIO': 'Funcionário'
    };
    const upperRole = String(role).toUpperCase();
    return roleMap[upperRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="Semi bold">
          Área do Administrador
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          sx={{ ...yellowButtonSx, borderRadius: "20px", px: 2, py: 1 }}
          onClick={onAddUser}
        >
          CADASTRAR NOVO USUÁRIO
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Ordem das colunas alterada no Head */}
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nível de Acesso</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, idx) => {
                
                const myRole = (currentUserRole || '').toUpperCase();
                const targetRole = (user.role || '').toUpperCase();
                const isSelf = user.id == currentUserId; 

                const isTargetEmployee = targetRole !== 'SUPER_ADMIN' && targetRole !== 'ADMINISTRADOR'; 

                let canEdit = false;
                if (myRole === 'SUPER_ADMIN') {
                  canEdit = true;
                } else if (myRole === 'ADMINISTRADOR') {
                  canEdit = isSelf || isTargetEmployee; 
                } else {
                  canEdit = isSelf; 
                }

                let canDelete = false;
                if (myRole === 'SUPER_ADMIN') {
                  canDelete = !isSelf; 
                } else if (myRole === 'ADMINISTRADOR') {
                  canDelete = isSelf || isTargetEmployee; 
                } else {
                  canDelete = isSelf;
                }

                return (
                  <TableRow
                    key={user.id}
                    sx={(theme) => ({
                      backgroundColor: idx % 2 ? theme.palette.action.hover : "transparent",
                    })}
                  >
                    {/* Ordem das colunas alterada no Body */}
                    <TableCell>{user.nome ?? "-"}</TableCell>
                    <TableCell>{user.matricula ?? "-"}</TableCell>
                    <TableCell>{user.cpf ?? "-"}</TableCell>
                    <TableCell>{user.email ?? "-"}</TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={user.isEnabled ? "Ativo" : "Pendente"} 
                        size="small" 
                        sx={{
                          fontWeight: 'bold',
                          backgroundColor: user.isEnabled ? "#e8f5e9" : "#fff3e0",
                          color: user.isEnabled ? "#2e7d32" : "#ef6c00",
                          border: `1px solid ${user.isEnabled ? "#a5d6a7" : "#ffe0b2"}`,
                        }}
                      />
                    </TableCell>

                    <TableCell>{formatRole(user.role)}</TableCell>
                    
                    <TableCell align="center">
                      {canEdit && (
                        <IconButton onClick={() => onEditUser(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}

                      {canDelete && (
                        <IconButton onClick={() => onDeleteUser(user)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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