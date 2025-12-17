import React from "react";
import { DialogActions, Button } from "@mui/material";
import { ModalBase } from "../../../components/ModalBase";

export default function ConfirmaDialog({ open, onClose, onConfirm, title }) {
  return (
    <ModalBase 
      open={open} 
      onClose={onClose} 
      title={title || "Tem certeza que deseja excluir?"}
    >
      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#343a40",
            color: "#ffffff",
            fontWeight: "normal",
            "&:hover": { backgroundColor: "#23272b" },
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
            fontWeight: "normal",
            "&:hover": { backgroundColor: "#e0c850" },
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </ModalBase>
  );
}