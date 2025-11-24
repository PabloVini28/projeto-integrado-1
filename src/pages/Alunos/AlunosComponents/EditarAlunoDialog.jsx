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


export default function EditarAlunoDialog({ open, onClose, onSave, alunoParaEditar }) {

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
            setPlano(alunoParaEditar.plano || '');
            setGenero(alunoParaEditar.genero || 'prefiro');
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
            plano, genero
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
                    '&::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.15)',
                        borderRadius: '20px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    }
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

                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', mt: 1 }}
                    >
                        Informações Pessoais:
                    </Typography>
                    
                    <TextField 
                        label="Nome Completo*" 
                        size="small" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        error={error && !nome}
                    />
                    
                    <ThemeProvider theme={blackTheme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                                label="Data de Nascimento*"
                                value={dataNascimento}
                                onChange={(newValue) => setDataNascimento(newValue)}
                                format="dd/MM/yyyy"
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        error: error && !dataNascimento 
                                    } 
                                }}
                                disableFuture
                            />
                        </LocalizationProvider>
                    </ThemeProvider>

                    <TextField 
                        label="E-mail*" 
                        size="small" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        error={error && !email}
                    />
                    <TextField 
                        label="Endereço*" 
                        size="small" 
                        value={endereco} 
                        onChange={(e) => setEndereco(e.target.value)} 
                        error={error && !endereco}
                    />
                    <TextField 
                        label="Telefone*" 
                        size="small" 
                        value={telefone} 
                        onChange={(e) => setTelefone(e.target.value)} 
                        error={error && !telefone}
                    />
                    <TextField 
                        label="CPF*" 
                        size="small" 
                        value={cpf} 
                        onChange={(e) => setCpf(e.target.value)} 
                        error={error && !cpf}
                    />

                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', pt: 1 }}
                    >
                        Informações Administrativas e Financeiras:
                    </Typography>
                    <ThemeProvider theme={blackTheme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                                label="Data de início"
                                value={dataInicio}
                                onChange={(newValue) => setDataInicio(newValue)}
                                format="dd/MM/yyyy"
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        error: error && !dataInicio
                                    } 
                                }}
                                disabled={true}
                                disableFuture
                            />
                        </LocalizationProvider>
                    </ThemeProvider>

                    <TextField 
                        label="Plano*" 
                        size="small" 
                        value={plano} 
                        onChange={(e) => setPlano(e.target.value)} 
                        error={error && !plano}
                    />

                    <FormControl sx={{ pt: 1, pb: 1 }}>
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
                            <FormControlLabel value="masculino" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label={<Typography variant="body2">Masculino</Typography>} />
                            <FormControlLabel value="feminino" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label={<Typography variant="body2">Feminino</Typography>} />
                            <FormControlLabel value="prefiro" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#F2D95C' } }} />} label={<Typography variant="body2">Prefiro não informar</Typography>} />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}
            >
                <Button
                    onClick={onClose}
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
                    Salvar aluno
                </Button>
            </DialogActions>
        </Dialog>
    );
}