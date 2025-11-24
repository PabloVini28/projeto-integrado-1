import React, { useState, useEffect } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, InputAdornment, Typography
} from '@mui/material';

const cleanCurrency = (formattedValue) => {
    if (!formattedValue) return '';
    return formattedValue.replace(/[R$\s]/g, '').replace('.', ',');
};

const errorTextFieldStyle = {
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: 'red !important',
    },
    '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'darkred !important',
    },
    '& .MuiInputLabel-root.Mui-error': {
        color: 'red !important',
    },
};

export function PlanoFormDialog({ open, onClose, onSave, title, planToEdit }) {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [valor, setValor] = useState('');
    const [status, setStatus] = useState('ativo');
    
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

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
        setError(false);
        setErrorMessage('');
        setFieldErrors({});
    }, [planToEdit, open]);

    const handleValueChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9,.]/g, '');
        const formattedValue = formatCurrencyInput(rawValue);
        setValor(formattedValue);
        resetFieldError('valor');
    };

    const handleNomeChange = (e) => {
        setNome(e.target.value);
        resetFieldError('nome');
    };
    
    const handleCodigoChange = (e) => {
        setCodigo(e.target.value);
        resetFieldError('codigo');
    };

    const resetFieldError = (name) => {
        setError(false);
        setFieldErrors(prev => ({...prev, [name]: false}));
        setErrorMessage('');
    };

    const formatCurrencyInput = (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length === 0) return '';
        const amount = parseInt(digits, 10);
        const reais = amount / 100;
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
        }).format(reais);
    };

    const handleSave = () => {
        let errors = {};
        
        const isNomeEmpty = nome.trim() === '';
        const isValorEmpty = valor.trim() === '';

        if (isNomeEmpty || isValorEmpty) {
            if (isNomeEmpty) errors.nome = true;
            if (isValorEmpty) errors.valor = true;
            
            setFieldErrors(errors);
            setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
            setError(true);
            return;
        }

        const valorLimpoParaCalculo = valor.replace(/\./g, '').replace(',', '.');
        const valorNumerico = parseFloat(valorLimpoParaCalculo) || 0;
        
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            errors.valor = "O valor deve ser numérico e maior que zero.";
        }

        const hasSpecificErrors = Object.keys(errors).length > 0;

        if (hasSpecificErrors) {
            setFieldErrors(errors);
            setErrorMessage("Corrija os campos em erro.");
            setError(true);
            return;
        }

        const planoData = {
            id: planToEdit ? planToEdit.id : undefined,
            nome,
            codigo: isEditMode ? codigo : undefined, 
            valor: valorNumerico,
            status
        };
        onSave(planoData);
        onClose();
    };
    
    const isNomeError = !!fieldErrors.nome;
    const isValorError = !!fieldErrors.valor;

    const blackFocusedStyle = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'black',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#343a40',
        },
    };

    const getSx = (isFieldInError) => ({
        ...blackFocusedStyle,
        ...(isFieldInError && errorTextFieldStyle),
    });

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
                    textAlign: 'center', 
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
                {error && (
                    <Typography color="error" variant="body2" mb={1} textAlign="center" fontWeight="bold">
                        {errorMessage}
                    </Typography>
                )}
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1}}>
                    <TextField
                        required
                        id="nome"
                        label="Nome do Plano"
                        fullWidth
                        size="small"
                        value={nome}
                        onChange={handleNomeChange}
                        error={isNomeError}
                        helperText={error && isNomeError ? fieldErrors.nome : ''}
                        sx={getSx(isNomeError)}
                    />
                    
                    {isEditMode && (
                         <TextField
                            id="codigo"
                            label="Código (Não Editável)" 
                            fullWidth
                            size="small"
                            value={codigo}
                            disabled={true} 
                            sx={isEditMode ? { 
                                '& .MuiInputBase-input.Mui-disabled': { 
                                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)', 
                                    color: 'rgba(0, 0, 0, 0.6)'
                                },
                                ...getSx(false),
                                '& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)', 
                                }
                            } : {}}
                        />
                    )}
                    
                    <TextField
                        required
                        id="valor"
                        label="Valor"
                        fullWidth
                        size="small"
                        value={valor}
                        onChange={handleValueChange}
                        error={isValorError}
                        helperText={error && isValorError ? fieldErrors.valor : ''}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            inputMode: 'numeric',
                        }}
                        sx={getSx(isValorError)}
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
                            />
                            <FormControlLabel 
                                value="inativo" 
                                control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} 
                                label={<Typography variant="body2">Inativo</Typography>}
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    sx={{ backgroundColor: '#343a40', color: 'white', fontWeight: 'normal', textTransform: 'uppercase', '&:hover': { backgroundColor: '#23272b' } }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    sx={{ backgroundColor: '#F2D95C', color: 'black', fontWeight: 'normal', textTransform: 'uppercase', '&:hover': { backgroundColor: '#e0c850' } }}
                >
                    {isEditMode ? "Salvar Plano" : "Salvar Plano"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}