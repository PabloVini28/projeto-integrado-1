import React from "react";
import { DialogActions, Button } from "@mui/material";
import { ModalBase } from "../../../components/ModalBase";

export function ExcluirPlanoDialog({ open, onClose, onConfirm, planToDelete }) {
  const modalTitle = `Tem certeza que deseja excluir o plano "${planToDelete?.nome || ""}"?`;

  return (
    <ModalBase open={open} onClose={onClose} title={modalTitle}>
      <DialogActions sx={{ gap: 1, px: 3, pb: 2, pt: 1, justifyContent: "flex-end" }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            backgroundColor: "#343a40", 
            color: "white",
            "&:hover": { backgroundColor: "#23272b" } 
          }}
        >
          Voltar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          sx={{ 
            backgroundColor: "#F2D95C", 
            color: "black",
            "&:hover": { backgroundColor: "#e0c850" }
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </ModalBase>
  );
}