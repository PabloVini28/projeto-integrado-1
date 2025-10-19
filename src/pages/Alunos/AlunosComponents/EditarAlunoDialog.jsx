import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    Box, TextField, Typography, FormControl, FormLabel, RadioGroup, 
    FormControlLabel, Radio, InputLabel, Select, MenuItem 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';


export default function EditarAlunoDialog({ open, onClose, onSave, alunoParaEditar }) {

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

    useEffect(() => {
        if (alunoParaEditar) {
            setNome(alunoParaEditar.nome || '');
            setPlano(alunoParaEditar.plano || '');
            setGenero(alunoParaEditar.genero || 'prefiro'); 
            setFormaPagamento(alunoParaEditar.formaPagamento || '');
            setEmail(alunoParaEditar.email || '');
            setEndereco(alunoParaEditar.endereco || '');
            setTelefone(alunoParaEditar.telefone || '');
            setCpf(alunoParaEditar.cpf || '');

            if (alunoParaEditar.dataNascimento) {
                const [day, month, year] = alunoParaEditar.dataNascimento.split('/');
                setDataNascimento(new Date(`${year}-${month}-${day}`));
            } else {
                setDataNascimento(null);
            }

            if (alunoParaEditar.data_matricula) { 
                const [day, month, year] = alunoParaEditar.data_matricula.split('/');
                setDataInicio(new Date(`${year}-${month}-${day}`));
            } else {
                setDataInicio(null);
            }
            
        } else {
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
        }
    }, [alunoParaEditar, open]); 

    const handleSave = () => {
        const alunoEditado = {
            id: alunoParaEditar.id, 
            nome, dataNascimento, email, endereco, telefone, cpf,
            dataInicio, 
            plano, formaPagamento, genero
        };
        console.log("Salvando aluno editado:", alunoEditado);
        onSave(alunoEditado);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ 
                sx: { 
                    borderRadius: 2, 
                    maxWidth: '600px',
                } 
            }}
            fullWidth
        >
            <DialogTitle sx={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', pb: 1, pt: 3 }}>
                Editar um Aluno
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                    
                    <Typography variant="h6" sx={{ fontWeight: 'normal' }}>Informações Pessoais:</Typography>
                    <TextField label="Nome Completo*" value={nome} onChange={(e) => setNome(e.target.value)} />
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Nascimento*"
                            value={dataNascimento}
                            onChange={(newValue) => setDataNascimento(newValue)}
                            format="dd/MM/yyyy"
                        />
                    </LocalizationProvider>

                    <TextField label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    <TextField label="Telefone*" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                    <Typography variant="h6" sx={{ fontWeight: 'normal', pt: 2 }}>Informações Administrativas e Financeiras:</Typography>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de início"
                            value={dataInicio}
                            onChange={(newValue) => setDataInicio(newValue)}
                            format="dd/MM/yyyy"
                            disabled={true}
                        />
                    </LocalizationProvider>
                    
                    <TextField label="Plano" value={plano} onChange={(e) => setPlano(e.target.value)} />
                    
                    <FormControl variant="outlined">
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

                    <FormControl>
                        <FormLabel 
                            sx={{ 
                                color: 'rgba(0, 0, 0, 0.6)', 
                                '&.Mui-focused': {
                                    color: 'rgba(0, 0, 0, 0.6)' 
                                }
                            }}
                        >
                            Gênero:
                        </FormLabel>
                        <RadioGroup row value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <FormControlLabel value="masculino" control={<Radio sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label="Masculino" />
                            <FormControlLabel value="feminino" control={<Radio sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label="Feminino" />
                            <FormControlLabel value="prefiro" control={<Radio sx={{'&.Mui-checked': { color: '#F2D95C' }}} />} label="Prefiro não informar" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '24px', justifyContent: 'flex-start', gap: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: '#343a40', 
                        color: 'white', 
                        '&:hover': { backgroundColor: '#23272b' }, 
                        fontWeight: 'normal', 
                        width: '180px',
                        height: '40px'
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
                        fontWeight: 'bold', 
                        width: '180px',
                        height: '40px'
                    }}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}