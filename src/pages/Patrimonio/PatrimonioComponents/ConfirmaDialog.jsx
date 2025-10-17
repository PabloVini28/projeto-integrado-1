import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogActions, 
    Button 
} from '@mui/material';

export default function ConfirmaDialog({ open, onClose, onConfirm, title }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: '420px', 
                }
            }}
        >
            <DialogTitle sx={{ px: 3, pt: 3, pb: 2, fontWeight: 'normal', fontSize: '1.5rem', textAlign: 'left' }}>
                {title || "Tem certeza que deseja excluir?"}
            </DialogTitle>
            
            <DialogActions sx={{ 
                px: 6, 
                pb: 3,
                pt: 1,
                gap: 1 
            }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: '#343a40',
                        color: '#ffffffff',
                        fontWeight: 'normal',
                        '&:hover': { backgroundColor: '#23272b' },
                    }}
                >
                    Voltar
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
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