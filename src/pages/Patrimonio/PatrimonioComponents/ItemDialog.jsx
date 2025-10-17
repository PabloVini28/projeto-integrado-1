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
    
    //estados internos para controlar os campos do formulário
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState(null);
    const [status, setStatus] = useState('ativo');

    // useEffect preenche o formulário quando um item é passado para edição
    useEffect(() => {
        if (itemToEdit) {
            setNome(itemToEdit.nome || '');
            setCodigo(itemToEdit.codigo || '');
            // Converte a string de data para um objeto Date
            const [day, month, year] = itemToEdit.dataAquisicao.split('/');
            setDataAquisicao(new Date(`${year}-${month}-${day}`));
            setStatus(itemToEdit.status.toLowerCase() || 'ativo');
        } else {
            // Limpa o formulário para o modo de adição
            setNome('');
            setCodigo('');
            setDataAquisicao(null);
            setStatus('ativo');
        }
    }, [itemToEdit, open]); 

    const handleSave = () => {
        const itemData = { nome, codigo, dataAquisicao, status };
        console.log("Salvando item:", itemData);
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
                {/*O título é dinâmico */}
                {title || "Cadastre um novo Item"}
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
                    <TextField
                        id="codigo"
                        label="Código"
                        fullWidth
                        size="small"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Aquisição"
                            format="dd/MM/yyyy"
                            value={dataAquisicao}
                            onChange={(newValue) => setDataAquisicao(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <FormLabel>Status:</FormLabel>
                        <RadioGroup 
                            row 
                            name="status-group"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <FormControlLabel value="ativo" control={<Radio size="small" />} label="Ativo" />
                            <FormControlLabel value="inativo" control={<Radio size="small" />} label="Inativo" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 24px', justifyContent: 'center', gap: 1 }}>
                <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#343a40', color: 'white', '&:hover': { backgroundColor: '#23272b' }}}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#F2D95C', color: 'black', '&:hover': { backgroundColor: '#e0c850' }}}>
                    Salvar Item
                </Button>
            </DialogActions>
        </Dialog>
    );
}