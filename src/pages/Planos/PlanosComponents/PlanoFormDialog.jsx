import React, { useState, useEffect } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, FormLabel, FormControl, RadioGroup, FormControlLabel, Radio, InputAdornment, Typography
} from '@mui/material';

const cleanCurrency = (formattedValue) => {
    if (!formattedValue) return '';
    return formattedValue.replace(/[R$\s]/g, '').replace('.', ',');
};

export function PlanoFormDialog({ open, onClose, onSave, title, planToEdit }) {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [valor, setValor] = useState('');
    const [status, setStatus] = useState('ativo');
    const isEditMode = !!planToEdit;

    useEffect(() => {
        if (planToEdit) {
            setNome(planToEdit.nome || '');
            setCodigo(planToEdit.codigo || '');
            setValor(cleanCurrency(planToEdit.valor)); 
            setStatus(planToEdit.status.toLowerCase() || 'ativo');
        } else {
            setNome('');
            setCodigo('');
            setValor('');
            setStatus('ativo');
        }
    }, [planToEdit, open]);

    const handleSave = () => {
        const valorNumerico = parseFloat(valor.replace(',', '.')) || 0;
        const planoData = {
            id: planToEdit ? planToEdit.id : undefined,
            nome,
            codigo,
            valor: valorNumerico,
            status
        };
        onSave(planoData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2, maxWidth: '420px' } }}
        >
            <DialogTitle 
                sx={{ 
                    textAlign: 'left', 
                    fontWeight: 'bold', 
                    fontSize: '1.5rem', 
                    pt: 2, 
                    pb: 0.5,
                    px: 3 
                }}
            >
                {title || (isEditMode ? "Editar Plano" : "Cadastrar Novo Plano")}
            </DialogTitle>
            <DialogContent sx={{ px: 3, pt: 1, pb: 0 }}>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
                    <TextField
                        autoFocus
                        required
                        id="nome"
                        label="Nome do Plano"
                        fullWidth
                        size="small"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <TextField
                        id="codigo"
                        label={isEditMode ? "Código (Não Editável)" : "Código"} 
                        placeholder={isEditMode ? codigo : ""}
                        fullWidth
                        size="small"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        disabled={isEditMode} 
                        sx={isEditMode ? { 
                            '& .MuiInputBase-input.Mui-disabled': { 
                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)', 
                                color: 'rgba(0, 0, 0, 0.6)'
                            } 
                        } : {}} 
                    />
                    
                    <TextField
                        id="valor"
                        label="Valor*"
                        fullWidth
                        size="small"
                        value={valor}
                        onChange={(e) => setValor(e.target.value.replace(/[^0-9,.]/g, ''))}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                    />

                    <FormControl sx={{ pt: 1 }}>
                        <FormLabel 
                            sx={{
                                color: 'rgba(0, 0, 0, 0.6)',
                                '&.Mui-focused': { color: 'rgba(0, 0, 0, 0.6)' },
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
    <FormControlLabel 
        value="ativo" 
        control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} 
        label={<Typography variant="body2">Ativo</Typography>} 
        sx={{
            '&:hover': {
                backgroundColor: 'transparent',
                borderRadius: '4px' 
            }
        }}
    />
    <FormControlLabel 
        value="inativo" 
        control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} 
        label={<Typography variant="body2">Inativo</Typography>}
        sx={{
            '&:hover': {
                backgroundColor: 'transparent',
                borderRadius: '4px' 
            }
        }}
    />
</RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    sx={{ backgroundColor: '#343a40', color: 'white', fontWeight: 'normal', '&:hover': { backgroundColor: '#23272b' } }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    sx={{ backgroundColor: '#F2D95C', color: 'black', fontWeight: 'normal', '&:hover': { backgroundColor: '#e0c850' } }}
                >
                    {isEditMode ? "Salvar Alterações" : "Salvar Plano"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}