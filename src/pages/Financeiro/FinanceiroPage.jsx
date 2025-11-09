import React, { useState } from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SummaryCard from "./FinanceiroComponents/SummaryCard.jsx";
import FinanceTable from "./FinanceiroComponents/FinanceTable.jsx";
import ItemDialog from "./FinanceiroComponents/ItemDialog.jsx";
import ConfirmaDialog from "./FinanceiroComponents/ConfirmaDialog.jsx";

const receitasData = [
  { id: 1, descricao: "Internet", categoria: "Alunos", valor: 80.0 },
  { id: 2, descricao: "Água", categoria: "Alunos", valor: 80.0 },
  { id: 3, descricao: "Aluguel", categoria: "Outras", valor: 1200.0 },
  { id: 4, descricao: "Salário Funcionário", categoria: "Alunos", valor: 80.0 },
  { id: 5, descricao: "Energia", categoria: "Alunos", valor: 80.0 },
  { id: 6, descricao: "Mensalidade", categoria: "Alunos", valor: 150.0 },
  { id: 7, descricao: "Taxa Matrícula", categoria: "Alunos", valor: 50.0 },
  { id: 8, descricao: "Venda de Suplemento", categoria: "Outras",valor: 250.0,},
  { id: 9, descricao: "Mensalidade Extra", categoria: "Alunos", valor: 150.0 },
  { id: 10, descricao: "Aulas Particulares", categoria: "Outras", valor: 300.0,},
  { id: 11, descricao: "Doação", categoria: "Outras", valor: 20.0 },
  { id: 12, descricao: "Consultoria", categoria: "Outras", valor: 100.0 },
  { id: 13, descricao: "Mensalidade", categoria: "Alunos", valor: 150.0 },
];

const despesasData = [
  { id: 1, descricao: "Mensalidade Aluno(a)", categoria: "Receita", valor: 120.0, },
  { id: 2, descricao: "Água", categoria: "Despesa", valor: 100.0 },
  { id: 3, descricao: "Aluguel", categoria: "Despesa", valor: 1200.0 },
  { id: 4, descricao: "Mensalidade Aluno(a)", categoria: "Receita", valor: 120.0, },
  { id: 5, descricao: "Energia", categoria: "Despesa", valor: 500.0 }, 
];

export default function FinanceiroPage() {
  const [receitasPage, setReceitasPage] = useState(0);
  const [despesasPage, setDespesasPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCurrentRecipe, setIsCurrentRecipe] = useState(true);

  const handleReceitasPageChange = (event, newPage) => setReceitasPage(newPage);
  const handleDespesasPageChange = (event, newPage) => setDespesasPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setReceitasPage(0);
    setDespesasPage(0);
  };

  const handleOpenAdd = (isRecipe) => {
    setIsCurrentRecipe(isRecipe);
    setCurrentItem(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item, isRecipe) => {
    setIsCurrentRecipe(isRecipe);
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id, isRecipe) => {
    setItemToDelete({ id, type: isRecipe ? "Receita" : "Despesa" });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log(`Excluindo ${itemToDelete.type} com ID: ${itemToDelete.id}`);
    handleCloseDialogs();
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
    setItemToDelete(null);
  };

  const handleSaveNewItem = (data) => {
    console.log(`Salvando NOVA Transação (${data.type}):`, data);
    handleCloseDialogs();
  };

  const handleUpdateItem = (data) => {
    console.log(
      `Atualizando Transação (${data.type}) com ID ${currentItem.id}:`,
      data
    );
    handleCloseDialogs();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Financeiro
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="RECEITAS DE ALUNOS"
            value="R$ 15.200"
            isGreen={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="OUTRAS RECEITAS" value="R$ 10.000" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="DESPESAS (MÊS)" value="R$ 4.200" isRed={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="RESULTADO" value="R$ 25.200" />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => handleOpenAdd(false)}
          sx={{
            backgroundColor: "#F2D95C",
            color: "black",
            fontWeight: "normal",
            borderRadius: "50px",
            "&:hover": { backgroundColor: "#e0c850" },
          }}
        >
          REGISTRAR DESPESA
        </Button>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => handleOpenAdd(true)}
          sx={{
            backgroundColor: "#F2D95C",
            color: "black",
            fontWeight: "normal",
            borderRadius: "50px",
            "&:hover": { backgroundColor: "#e0c850" },
          }}
        >
          REGISTRAR RECEITA
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FinanceTable
            title="Receitas"
            rows={receitasData}
            isRecipe={true}
            page={receitasPage}
            rowsPerPage={rowsPerPage}
            count={receitasData.length}
            onPageChange={handleReceitasPageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FinanceTable
            title="Despesas"
            rows={despesasData}
            isRecipe={false}
            page={despesasPage}
            rowsPerPage={rowsPerPage}
            count={despesasData.length}
            onPageChange={handleDespesasPageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>

      <ItemDialog
        open={isAddDialogOpen}
        onClose={handleCloseDialogs}
        onSave={handleSaveNewItem}
        title={`Adicionar ${isCurrentRecipe ? "Receita" : "Despesa"}`}
        isRecipe={isCurrentRecipe}
      />

      <ItemDialog
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        onSave={handleUpdateItem}
        title={`Editar ${isCurrentRecipe ? "Receita" : "Despesa"}`}
        itemToEdit={currentItem}
        isRecipe={isCurrentRecipe}
      />

      <ConfirmaDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDialogs}
        onConfirm={confirmDelete}
        title={`Tem certeza que deseja excluir esta ${itemToDelete ? itemToDelete.type.toLowerCase() : "transação"}?`}
      />
    </Paper>
  );
}