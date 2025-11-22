import React from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions,
} from '@mui/material';

const yellowButtonSx = {
  bgcolor: '#F2D95C',
  color: 'black',
  fontWeight: 'normal',
  '&:hover': {
    bgcolor: '#e0c850',
  },
  textTransform: 'none',
};

const grayButtonSx = {
  bgcolor: '#343a40',
  color: 'white',
  fontWeight: 'normal',
  '&:hover': {
    bgcolor: '#23272b',
  },
  textTransform: 'none',
};


export default function ExcluirUsuarioDialog({ open, onClose, onConfirm, user }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold" textAlign="center">Tem certeza que deseja excluir o usuário: {user?.nome}?</DialogTitle>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>
          VOLTAR
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={yellowButtonSx}>
          EXCLUIR
        </Button>
      </DialogActions>
    </Dialog>
  );
}