import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';

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

export default function ExcluirUsuarioDialog({ open, onClose, onConfirm, user, currentUser }) {
  const [adminPassword, setAdminPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setAdminPassword('');
      setReason('');
      setError('');
    }
  }, [open]);

  const handleConfirm = () => {
    setError('');
    const requesterRole = (currentUser?.role || '').toUpperCase();
    const requiresPassword = requesterRole === 'ADMINISTRADOR' || requesterRole === 'SUPER_ADMIN';

    if (requiresPassword) {
      if (!adminPassword) {
        setError('Digite sua senha para confirmar a ação.');
        return;
      }
      onConfirm({ adminPassword, reason });
    } else {
      onConfirm({});
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: '400px' } }}>
      <DialogTitle fontWeight="bold" textAlign="center" sx={{ px: 3, pt: 3, pb: 2, fontSize: '1.5rem' }}>
        {user && currentUser && user.id === currentUser.id
          ? `Você tem certeza que deseja excluir seu usuário: ${user?.nome}?`
          : `Tem certeza que deseja excluir o usuário: ${user?.nome}?`}
      </DialogTitle>
      <DialogContent>
        {(() => {
          const requesterRole = (currentUser?.role || '').toUpperCase();
          const requiresPassword = requesterRole === 'ADMINISTRADOR' || requesterRole === 'SUPER_ADMIN';

          if (requiresPassword) {
            return (
              <>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Esta ação é irreversível (ou requer auditoria). É necessário digitar sua senha para confirmar.
                </Typography>
                <TextField
                  label="Sua senha de administrador*"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  sx={{ mt: 1, mb: 2 }}
                />
                <TextField
                  label="Motivo da exclusão (opcional)"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                {error && <Typography color="error" mt={1}>{error}</Typography>}
              </>
            );
          }

          return <Typography sx={{ px: 3, pt: 1, pb: 2 }}>Confirme a exclusão permanente do usuário.</Typography>;
        })()}
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} variant="contained" sx={grayButtonSx}>VOLTAR</Button>
        <Button onClick={handleConfirm} variant="contained" sx={yellowButtonSx}>
          {(user?.role === 'ADMINISTRADOR' || user?.role === 'SUPER_ADMIN') ? 'DEMITIR ADMIN' : 'EXCLUIR'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}