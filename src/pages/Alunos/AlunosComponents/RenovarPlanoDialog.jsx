import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export default function RenovarPlanoDialog({
  open,
  onClose,
  onConfirm,
  listaPlanos,
}) {
  const [codPlano, setCodPlano] = useState("");

  const handleConfirm = () => {
    if (!codPlano) return;
    onConfirm(codPlano);
    setCodPlano("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Renovar Plano
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 2, textAlign: "center" }}
        ></Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Novo Plano</InputLabel>
          <Select
            value={codPlano}
            label="Novo Plano"
            onChange={(e) => setCodPlano(e.target.value)}
          >
            {listaPlanos.map((p) => (
              <MenuItem key={p.cod_plano} value={p.cod_plano}>
                {p.nome_plano} - R$ {parseFloat(p.valor_plano).toFixed(2)} /{" "}
                {p.duracao_unidade}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ bgcolor: "#F2D95C", color: "black" }}
          disabled={!codPlano}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}