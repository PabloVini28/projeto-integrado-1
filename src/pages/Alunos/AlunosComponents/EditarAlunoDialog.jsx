import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, TextField, Typography, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function EditarAlunoDialog({ open, onClose, onSave, alunoParaEditar, listaPlanos = [] }) {

    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState(null);
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataInicio, setDataInicio] = useState(null);
    const [plano, setPlano] = useState('');
    const [genero, setGenero] = useState('prefiro');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (alunoParaEditar) {
            setNome(alunoParaEditar.nome || '');
            setPlano(alunoParaEditar.cod_plano || ''); 
            setGenero(alunoParaEditar.genero || 'prefiro'); 
            setEmail(alunoParaEditar.email || '');
            
            const end = alunoParaEditar.endereco?.logradouro 
                ? `${alunoParaEditar.endereco.logradouro}, ${alunoParaEditar.endereco.numero || ''}`
                : (alunoParaEditar.endereco || '');
            setEndereco(end);
            setTelefone(alunoParaEditar.telefone || '');
            setCpf(alunoParaEditar.cpf || '');

            if (alunoParaEditar.dataNascimento) {
                const d = new Date(alunoParaEditar.dataNascimento);
                if (!isNaN(d.getTime())) {
                    setDataNascimento(d);
                } else if (typeof alunoParaEditar.dataNascimento === 'string') {
                    const parts = alunoParaEditar.dataNascimento.split('/');
                    if(parts.length === 3) setDataNascimento(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`));
                }
            } else {
                setDataNascimento(null);
            }

            if (alunoParaEditar.data_matricula) { 
                const d = new Date(alunoParaEditar.data_matricula);
                if (!isNaN(d.getTime())) {
                    setDataInicio(d);
                } else if (typeof alunoParaEditar.data_matricula === 'string') {
                    const parts = alunoParaEditar.data_matricula.split('/');
                    if(parts.length === 3) setDataInicio(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`));
                }
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
            setGenero('prefiro');
        }
        setError(false);
    }, [alunoParaEditar, open]);

    const handleSave = () => {
        if (!nome || !dataNascimento || !email || !endereco || !telefone || !cpf || !dataInicio || !plano) {
            setError(true);
            return;
        }

        const alunoEditado = {
            id: alunoParaEditar.id,
            nome, dataNascimento, email, endereco, telefone, cpf,
            dataInicio, 
            
            cod_plano: plano, 
            
            genero
        };
        console.log("Salvando aluno editado:", alunoEditado);
        onSave(alunoEditado);
        onClose();
    };

    const blackTheme = createTheme({
        palette: {
            primary: {
                main: '#000000',
            },
        },
        components: {
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#333333',
                            },
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000000',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#343a40',
                        },
                        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'red !important',
                        },
                        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.23) !important',
                        },
                    }
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        '&.Mui-focused': {
                            color: '#000000',
                        },
                        '&.Mui-error': {
                            color: 'red !important',
                        },
                        '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                        }
                    }
                }
            }
        },
    });

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '450px',
                }
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    pt: 2,
                    pb: 0.5,
                    px: 3
                }}
            >
                Editar Aluno
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3,
                    pt: 1,
                    pb: 0,
                    '&::-webkit-scrollbar': { width: '0.4em' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.15)', borderRadius: '20px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(0,0,0,.3)' }
                }}
            >
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                        Preencha todos os campos obrigatórios.
                    </Typography>
                )}

                <Box
                    component="form"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1, ...blackFocusedStyle }}
                >
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
                        Informações Pessoais:
                    </Typography>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Nascimento*"
                            value={dataNascimento}
                            onChange={(newValue) => setDataNascimento(newValue)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { size: 'small' } }}
                            disableFuture
                        />
                    </LocalizationProvider>

                    <TextField label="E-mail" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Endereço" size="small" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    <TextField label="Telefone*" size="small" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    <TextField label="CPF" size="small" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', pt: 1 }}>
                        Informações Administrativas e Financeiras:
                    </Typography>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de início"
                            value={dataInicio}
                            onChange={(newValue) => setDataInicio(newValue)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { size: 'small' } }} 
                            disabled={true} 
                            disableFuture
                        />
                    </LocalizationProvider>
                    
                    <FormControl fullWidth size="small">
                        <InputLabel id="edit-plano-select-label">Plano</InputLabel>
                        <Select
                            labelId="edit-plano-select-label"
                            value={plano}
                            label="Plano"
                            onChange={(e) => setPlano(e.target.value)}
                        >
                            {listaPlanos.map((p) => (
                                <MenuItem key={p.cod_plano} value={p.cod_plano}>
                                    {p.nome_plano} - R$ {parseFloat(p.valor_plano).toFixed(2)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl sx={{ pt: 1, pb: 1 }}>
                        <FormLabel sx={{ color: 'rgba(0, 0, 0, 0.6)', '&.Mui-focused': { color: 'rgba(0, 0, 0, 0.6)' } }}>
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
            
            <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#343a40', color: 'white', '&:hover': { backgroundColor: '#23272b' }, fontWeight: 'normal' }}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#F2D95C', color: 'black', '&:hover': { backgroundColor: '#e0c850' }, fontWeight: 'normal' }}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}