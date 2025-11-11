import React, { useState, useEffect } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

export default function ItemDialog({ open, onClose, onSave, title, itemToEdit }) {

    const [nome, setNome] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState(null);
    const [status, setStatus] = useState('Em uso');

    useEffect(() => {
        if (itemToEdit) {
            setNome(itemToEdit.nome || '');
            setDataAquisicao(itemToEdit.data_aquisicao ? new Date(itemToEdit.data_aquisicao) : null);
            setStatus(itemToEdit.status_patrimonio || 'Em uso');
        } else {
            setNome('');
            setDataAquisicao(null);
            setStatus('Em uso');
        }
    }, [itemToEdit, open]);

    const handleSave = () => {
        const formattedDate = dataAquisicao ? dataAquisicao.toISOString().split('T')[0] : null;
        const itemData = {
            nome,
            data_aquisicao: formattedDate,
            status_patrimonio: status,
        };
        onSave(itemData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'normal', fontSize: '1.5rem', pb: 0 }}>
                {title || 'Cadastre um novo Item'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        autoFocus
                        required
                        id="nome"
                        label="Nome do Item"
                        fullWidth
                        size="small"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Aquisição"
                            value={dataAquisicao}
                            onChange={(newValue) => setDataAquisicao(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>

                    <FormControl>
                        <FormLabel
                            sx={{
                                color: '#23272b',
                                '&.Mui-focused': {
                                    color: '#23272b',
                                },
                            }}
                        >
                            Status:
                        </FormLabel>
                        <RadioGroup
                            row
                            name="status-group"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                                <FormControlLabel value="Em uso" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Em uso" />
                                <FormControlLabel value="Em manutenção" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Em manutenção" />
                                <FormControlLabel value="Disponível" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Disponível" />
                                <FormControlLabel value="Descartado" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label="Descartado" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#343a40', color: 'white', fontWeight: 'normal', '&:hover': { backgroundColor: '#23272b' } }}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#F2D95C', color: 'black', fontWeight: 'normal', '&:hover': { backgroundColor: '#e0c850' } }}>
                    Salvar Item
                </Button>
            </DialogActions>
        </Dialog>
    );
}