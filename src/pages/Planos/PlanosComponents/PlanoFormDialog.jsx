import React, { useState, useEffect } from "react";
import {
  Box,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { ModalBase } from "../../../components/ModalBase";

const blackFocusedStyle = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#343a40",
  },
};

const errorTextFieldStyle = {
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "red !important",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "red !important",
  },
};

const formatCurrency = (value) => {
  if (!value) return "";
  const numeric = value.replace(/\D/g, "");
  const number = Number(numeric) / 100;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function PlanoFormDialog({ open, onClose, onSave, title, planToEdit }) {
  const isEditMode = !!planToEdit;

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [valor, setValor] = useState("");
  const [valorFormatated, setValorFormatado] = useState("");
  const [status, setStatus] = useState("Ativo");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (planToEdit && open) {
      setNome(planToEdit.nome || "");
      setCodigo(planToEdit.codigo || "");
      const raw = String(Math.round(parseFloat(planToEdit.valor) * 100));
      setValor(raw);
      setValorFormatado(formatCurrency(raw));
      setStatus(planToEdit.status || "Ativo");
    } else if (open) {
      setNome("");
      setCodigo("");
      setValor("");
      setValorFormatado("");
      setStatus("Ativo");
    }
    setError(false);
    setErrorMessage("");
    setFieldErrors({});
  }, [planToEdit, open]);

  const handleValueChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 12) raw = raw.slice(0, 12);
    setValor(raw);
    setValorFormatado(formatCurrency(raw));
    resetFieldError("valor");
  };

  const resetFieldError = (name) => {
    setError(false);
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
    setErrorMessage("");
  };

  const handleSave = () => {
    if (nome.trim() === "" || valor.toString().trim() === "") {
      setFieldErrors({ nome: !nome.trim(), valor: !valor.toString().trim() });
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setError(true);
      return;
    }

    const valorNumerico = Number(valor) / 100;
    onSave({
      id: planToEdit?.id,
      nome,
      codigo: isEditMode ? codigo : undefined,
      valor: valorNumerico,
      status,
    });
    onClose();
  };

  const getSx = (isFieldInError) => ({
    ...blackFocusedStyle,
    ...(isFieldInError && errorTextFieldStyle),
  });

  return (
    <ModalBase 
      open={open} 
      onClose={onClose} 
      title={title || (isEditMode ? "Editar Plano" : "Cadastrar Novo Plano")}
    >
      <DialogContent sx={{ px: 3, pt: 1 }}>
        {error && (
          <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">
            {errorMessage}
          </Typography>
        )}
        
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Nome do Plano"
            fullWidth
            size="small"
            value={nome}
            onChange={(e) => { setNome(e.target.value); resetFieldError("nome"); }}
            error={!!fieldErrors.nome}
            sx={getSx(!!fieldErrors.nome)}
          />

          {isEditMode && (
            <TextField
              label="Código do Plano"
              fullWidth
              size="small"
              value={codigo}
              disabled
              sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "rgba(0, 0, 0, 0.6)" }, ...getSx(false) }}
            />
          )}

          <TextField
            label="Valor"
            fullWidth
            size="small"
            value={valorFormatated}
            onChange={handleValueChange}
            error={!!fieldErrors.valor}
            sx={getSx(!!fieldErrors.valor)}
          />

          <FormControl>
            <FormLabel sx={{ color: "#23272b", "&.Mui-focused": { color: "#23272b" } }}>Status:</FormLabel>
            <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
              <FormControlLabel value="Ativo" control={<Radio size="small" sx={{ "&.Mui-checked": { color: "#F2D95C" } }} />} label="Ativo" />
              <FormControlLabel value="Inativo" control={<Radio size="small" sx={{ "&.Mui-checked": { color: "#F2D95C" } }} />} label="Inativo" />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: "#343a40", color: "white", "&:hover": { backgroundColor: "#23272b" } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: "#F2D95C", color: "black", "&:hover": { backgroundColor: "#e0c850" } }}
        >
          Salvar Plano
        </Button>
      </DialogActions>
    </ModalBase>
  );
}