import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    Box, TextField, Typography, FormControl, FormLabel, RadioGroup, 
    FormControlLabel, Radio, InputLabel, Select, MenuItem 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

export default function CadastroAlunoDialog({ open, onClose, onSave }) {
    
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState(null);
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataInicio, setDataInicio] = useState(null);
    const [plano, setPlano] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');
    const [genero, setGenero] = useState('prefiro');

    const handleSave = () => {
        const novoAluno = {
            nome, dataNascimento, email, endereco, telefone, cpf,
            dataInicio, plano, formaPagamento, genero
        };
        console.log("Salvando novo aluno:", novoAluno);
        onSave(novoAluno);
        onClose();
    };

    const handleCancel = () => {
        setNome('');
        setDataNascimento(null);
        setEmail('');
        setEndereco('');
        setTelefone('');
        setCpf('');
        setDataInicio(null);
        setPlano('');
        setFormaPagamento('');
        setGenero('prefiro');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2, maxHeight: '450px'} }}
        >
            <DialogTitle 
                sx={{ 
                    textAlign: 'left', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    pt: 3,
                    pb: 1, 
                    px: 3 
                }}
            >
                Cadastre um novo Aluno
            </DialogTitle>

            <DialogContent 
                // 2. CSS PARA BARRA DE ROLAGEM DISCRETA
                sx={{ 
                    px: 3, 
                    pt: 1, 
                    pb: 0,
                    // Estilização WebKit (Chrome, Safari, Edge)
                    '&::-webkit-scrollbar': {
                        width: '0.4em', // Largura fina
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent', // Fundo transparente
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.15)', // Cor suave do "polegar"
                        borderRadius: '20px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'rgba(0,0,0,.3)', // Um pouco mais visível ao passar o mouse
                    }
                }}
            >
                <Box 
                    component="form" 
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}
                >
                    
                    <Typography 
                        variant="subtitle1" 
                        sx={{ fontWeight: 'bold', mt: 1 }}
                    >
                        Informações Pessoais:
                    </Typography>
                    <TextField label="Nome Completo*" size="small" value={nome} onChange={(e) => setNome(e.target.value)} />
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Nascimento*"
                            value={dataNascimento}
                            onChange={(newValue) => setDataNascimento(newValue)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>

                    <TextField label="E-mail" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Endereço" size="small" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    <TextField label="Telefone*" size="small" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    <TextField label="CPF" size="small" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                    <Typography 
                        variant="subtitle1" 
                        sx={{ fontWeight: 'bold', pt: 1 }}
                    >
                        Informações Administrativas e Financeiras:
                    </Typography>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de início"
                            value={dataInicio}
                            onChange={(newValue) => setDataInicio(newValue)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                    
                    <TextField label="Plano" size="small" value={plano} onChange={(e) => setPlano(e.target.value)} />
                    
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="forma-pagamento-label">Forma de Pagamento</InputLabel>
                        <Select
                            labelId="forma-pagamento-label"
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            label="Forma de Pagamento"
                        >
                            <MenuItem value="pix">Pix</MenuItem>
                            <MenuItem value="cartao">Cartão</MenuItem>
                            <MenuItem value="boleto">Boleto</MenuItem>
                            <MenuItem value="outro">Outro</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ pt: 1, pb: 1 }}>
                        <FormLabel 
                            sx={{ 
                                color: 'rgba(0, 0, 0, 0.6)', 
                                '&.Mui-focused': { color: 'rgba(0, 0, 0, 0.6)' }
                            }}
                        >
                            Gênero:
                        </FormLabel>
                        <RadioGroup row value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <FormControlLabel value="masculino" control={<Radio size="small" sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label={<Typography variant="body2">Masculino</Typography>} />
                            <FormControlLabel value="feminino" control={<Radio size="small" sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label={<Typography variant="body2">Feminino</Typography>} />
                            <FormControlLabel value="prefiro" control={<Radio size="small" sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label={<Typography variant="body2">Prefiro não informar</Typography>} />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            
            <DialogActions 
                sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}
            >
                <Button 
                    onClick={handleCancel} 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: '#343a40', 
                        color: 'white', 
                        '&:hover': { backgroundColor: '#23272b' }, 
                        fontWeight: 'normal', 
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
                        fontWeight: 'normal', 
                    }}
                >
                    Cadastrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}