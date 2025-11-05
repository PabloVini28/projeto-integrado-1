import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const tableColumns = [
  { id: "descricao", label: "Descrição" },
  { id: "categoria", label: "Categoria" },
  { id: "valor", label: "Valor", align: "right" },
  { id: "acao", label: "Ação", align: "center" },
];

export default function FinanceTable({
  title,
  rows,
  isRecipe,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}) {
  const type = isRecipe ? "Receita" : "Despesa";

  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          borderRadius: "8px",
        }}
      >
        <TableContainer>
          <Table size="small" aria-label={`tabela de ${type.toLowerCase()}`}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafafa" }}>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{ fontWeight: "bold", py: 1.5 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    {tableColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          sx={{ py: 1 }}
                        >
                          {column.id === "valor" ? (
                            `R$ ${value.toFixed(2).replace(".", ",")}`
                          ) : column.id === "acao" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => onEdit(row, isRecipe)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => onDelete(row.id, isRecipe)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} of ${count}`
          }
        />
      </Paper>
    </Box>
  );
}