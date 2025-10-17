import React from 'react';
import { 
    Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

export default function ItemDialog({ open, onClose, onSave }) {
    
    const handleSave = () => {
        onSave();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', pb: 0 }}>
                Cadastre um novo Item
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        autoFocus
                        required
                        id="nome"
                        label="Nome do Item"
                        type="text"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        id="codigo"
                        label="Código"
                        type="text"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Aquisição"
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <FormLabel>Status:</FormLabel>
                        <RadioGroup row defaultValue="ativo" name="status-group">
                            <FormControlLabel value="ativo" control={<Radio size="small" />} label="Ativo" />
                            <FormControlLabel value="inativo" control={<Radio size="small" />} label="Inativo" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 24px', justifyContent: 'center', gap: 1 }}>
                <Button 
                    onClick={onClose}
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#343a40',
                        color: 'white',
                        '&:hover': { backgroundColor: '#23272b' },
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave}
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#F2D95C',
                        color: 'black',
                        '&:hover': { backgroundColor: '#e0c850' },
                    }}
                    >
                    Salvar Item
                </Button>
            </DialogActions>
        </Dialog>
    );
}