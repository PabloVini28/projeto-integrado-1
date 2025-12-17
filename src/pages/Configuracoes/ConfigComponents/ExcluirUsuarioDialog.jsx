import React from 'react';
import {
  Button, DialogActions,
} from '@mui/material';
import { ModalBase } from "../../../components/ModalBase";

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: 'black',
  fontWeight: 'normal',
  '&:hover': { bgcolor: '#e0c850' },
  textTransform: 'none',
};

const grayButtonSx = {
  bgcolor: '#343a40',
  color: 'white',
  fontWeight: 'normal',
  '&:hover': { bgcolor: '#23272b' },
  textTransform: 'none',
};

export default function ExcluirUsuarioDialog({ open, onClose, onConfirm, user }) {
  const modalTitle = `Tem certeza que deseja excluir o usuário: ${user?.nome}?`;

  return (
    <ModalBase open={open} onClose={onClose} title={modalTitle}>
      <DialogActions sx={{ p: '0 24px 16px', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>VOLTAR</Button>
        <Button onClick={onConfirm} variant="contained" sx={yellowButtonSx}>EXCLUIR</Button>
      </DialogActions>
    </ModalBase>
  );
}