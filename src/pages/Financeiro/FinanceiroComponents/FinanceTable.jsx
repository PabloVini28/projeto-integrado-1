// src/pages/Financeiro/FinanceiroComponents/FinanceTable.jsx
import React, { useState } from "react";
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
  Collapse,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// ALTERAÇÃO: Adicionada "Data" e larguras ajustadas
const tableColumns = [
  { id: "expand", label: "", width: "5%" },
  { id: "id", label: "ID", width: "10%" },
  { id: "nome", label: "Nome", width: "25%" },
  { id: "categoria", label: "Categoria", width: "20%" },
  { id: "data", label: "Data", width: "15%", align: "left" }, // ADICIONADO
  { id: "valor", label: "Valor", align: "right", width: "15%" },
  { id: "acao", label: "Ação", align: "center", width: "10%" },
];

// --- Detalhes da linha expandida ---
function RowDetails({ item, isRecipe }) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 1,
        border: "1px solid #eee",
        m: 1,
      }}
    >
      <Grid container spacing={2}>
        {/* ALTERAÇÃO: 'Data' foi removida daqui */}

        {isRecipe && item.categoria === "Alunos" && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textTransform: "uppercase" }}
            >
              Aluno
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {item.nome_aluno || "Não informado"}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textTransform: "uppercase" }}
          >
            Descrição
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {item.descricao || "Não informado"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

// --- Linha principal ---
function RowItem({ row, isRecipe, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{
          "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
        }}
      >
        {tableColumns.map((column) => {
          const value = row[column.id];

          return (
            <TableCell
              key={column.id}
              align={column.align || "left"}
              sx={{
                py: 1.5,
                borderBottom: "1px solid #eee",
              }}
            >
              {column.id === "expand" ? (
                <IconButton size="small" onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              ) : column.id === "valor" ? (
                `R$ ${value.toFixed(2).replace(".", ",")}`
              ) : column.id === "acao" ? (
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                  <IconButton
                    size="small"
                    sx={{ color: "#343a40" }}
                    onClick={() => onEdit(row, isRecipe)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{ color: "#343a40" }}
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

      {/* Linha colapsável */}
      <TableRow>
        {/* ALTERAÇÃO: colSpan atualizado para 7 */}
        <TableCell
          colSpan={7}
          sx={{
            py: 0,
            borderBottom: "1px solid #eee",
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <RowDetails item={row} isRecipe={isRecipe} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// --- Tabela Principal ---
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
    <Box
      sx={{
        flexGrow: 1, 
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <Paper
        elevation={0}
        variant="outlined" // Usando a borda sutil
        sx={{
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexGrow: 1, // Corrigido para preencher a aba
        }}
      >
        <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#fff",
                      py: 1.5,
                      width: column.width, // Aplica a largura
                      borderBottom: "1px solid #eee",
                    }}
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
                  <RowItem
                    key={row.id}
                    row={row}
                    isRecipe={isRecipe}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={count}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            borderTop: "1px solid #eee",
            backgroundColor: "#fff",
          }}
          labelRowsPerPage="Itens por pág:" // Traduzido
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}` // Traduzido
          }
        />
      </Paper>
    </Box>
  );
}