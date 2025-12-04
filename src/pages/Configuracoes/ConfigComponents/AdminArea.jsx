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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const yellowButtonSx = {
  bgcolor: "#F2D95C",
  color: "black",
  fontWeight: "normal",
  "&:hover": {
    bgcolor: "#e0c850",
  },
  textTransform: "none",
};

const grayButtonSx = {
  bgcolor: "#343a40",
  color: "white",
  fontWeight: "normal",
  "&:hover": {
    bgcolor: "#23272b",
  },
  textTransform: "none",
};

export default function AdminArea({
  funcionarios,
  onAddUser,
  onEditUser,
  onDeleteUser,
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

  const capitalizeRole = (role) => {
    if (!role) return "Funcionário";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="Semi bold">
          Área do Administrador
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          endIcon={<Add />}
          sx={{ ...yellowButtonSx, borderRadius: "20px", px: 2, py: 1 }}
          onClick={onAddUser}
        >
          CADASTRAR NOVO USUÁRIO
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nível de Acesso</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ação
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, idx) => (
                <TableRow
                  key={user.id}
                  sx={(theme) => ({
                    backgroundColor:
                      idx % 2 ? theme.palette.action.hover : "transparent",
                  })}
                >
                  <TableCell>{user.nome ?? "-"}</TableCell>
                  <TableCell>{user.matricula ?? "-"}</TableCell>
                  <TableCell>{user.cpf ?? "-"}</TableCell>
                  <TableCell>{user.email ?? "-"}</TableCell>
                  <TableCell>{capitalizeRole(user.role)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEditUser(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onDeleteUser(user)}>
                      <Delete fontSize="small" />
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