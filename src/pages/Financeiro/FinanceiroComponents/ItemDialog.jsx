import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function ItemDialog({
  open,
  onClose,
  onSave,
  title,
  itemToEdit,
  isRecipe,
}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");

  const type = isRecipe ? "receita" : "despesa";
  const categoriasReceita = ["Alunos", "Outras"];
  const categoriasDespesa = [
    "Despesa",
    "Custo Fixo",
    "Imposto",
    "Salários",
    "Manutenção",
    "Água",
    "Luz",
    "Internet",
  ];

  useEffect(() => {
    const defaultCategoria = isRecipe
      ? categoriasReceita[0]
      : categoriasDespesa[0];

    if (itemToEdit) {
      setDescricao(itemToEdit.descricao || "");
      setValor(String(itemToEdit.valor) || "");
      setCategoria(itemToEdit.categoria || defaultCategoria);
    } else {
      setDescricao("");
      setValor("");
      setCategoria(defaultCategoria);
    }
  }, [itemToEdit, isRecipe, open]);

  const handleSave = () => {
    const itemData = {
      descricao,
      valor: parseFloat(valor),
      categoria,
      type: type,
    };
    onSave(itemData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "normal",
          fontSize: "1.5rem",
          pb: 0,
        }}
      >
        {title || `Cadastre uma nova ${type}`}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            autoFocus
            required
            id="descricao"
            label="Descrição*"
            fullWidth
            size="small"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <FormControl fullWidth size="small" required>
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select
              labelId="categoria-label"
              id="categoria"
              value={categoria}
              label="Categoria"
              onChange={(e) => setCategoria(e.target.value)}
            >
              {(isRecipe ? categoriasReceita : categoriasDespesa).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            required
            id="valor"
            label="Valor"
            fullWidth
            size="small"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
              type: "number",
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions
        sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="small" 
          sx={{
            backgroundColor: "#343a40",
            color: "white",
            "&:hover": { backgroundColor: "#23272b" },
            fontWeight: "normal",
			borderRadius: '8px',
          }}
        >
          CANCELAR
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small" 
          sx={{
            backgroundColor: "#F2D95C",
            color: "black",
            "&:hover": { backgroundColor: "#e0c850" },
            fontWeight: "normal", 
			borderRadius: '8px',
          }}
        >
          SALVAR {type.toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}