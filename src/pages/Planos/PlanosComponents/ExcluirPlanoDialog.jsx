import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogActions, 
    Button 
} from '@mui/material';

export function ExcluirPlanoDialog({ open, onClose, onConfirm, planToDelete }) {
    const title = `Tem certeza que deseja excluir o plano "${planToDelete?.nome || ''}"?`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxWidth: '420px', 
                }
            }}
            fullWidth
        >
            <DialogTitle sx={{ px: 3, pt: 3, pb: 2, fontWeight: 'normal', fontSize: '1.5rem', textAlign: 'left' }}>
                {title}
            </DialogTitle>
            
            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1, justifyContent: 'flex-end' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: '#343a40',
                        color: 'white',
                        fontWeight: 'normal',
                        '&:hover': { backgroundColor: '#23272b' },
                    }}
                >
                    Voltar
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: '#F2D95C',
                        color: 'black',
                        fontWeight: 'normal',
                        '&:hover': { backgroundColor: '#e0c850' },
                    }}
                >
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    );
}