import React, { useState, useEffect } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, InputAdornment, Typography, List, ListItemButton, 
    ListItemText, Paper, FormLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function RenovarMensalidadeDialog({ open, onClose, onRenovar, studentList = [] }) {
    
    const [step, setStep] = useState(1); // 1: Pesquisa, 2: Confirmação
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Limpa o estado quando o dialog é fechado
    useEffect(() => {
        if (!open) {
            setTimeout(() => { 
                setStep(1);
                setSearchTerm('');
                setFilteredStudents([]);
                setSelectedStudent(null);
            }, 300); 
        }
    }, [open]);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        if (term.trim()) {
            const filtered = studentList.filter(student =>
                student.nome.toLowerCase().includes(term.toLowerCase()) ||
                student.matricula.includes(term)
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setStep(2);
    };

    const handleRenovar = () => {
        console.log(`Renovando +30 dias para ${selectedStudent.nome}`);
        onRenovar(selectedStudent.id); 
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            PaperProps={{ 
                sx: { 
                    borderRadius: 2, 
                    // MAX WIDTH REDUZIDO PARA 420px
                    maxWidth: '420px', 
                } 
            }}
            fullWidth
        >
            <DialogTitle 
                // FONTE E PADDING REDUZIDOS
                sx={{ 
                    textAlign: 'left', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    pt: 2, 
                    pb: 0.5,
                    px: 3 
                }}
            >
                Renovar mensalidade
            </DialogTitle>

            {/* ----------------- STEP 1: PESQUISA ----------------- */}
            {step === 1 && (
                <>
                    <DialogContent sx={{ pt: 1, pb: 0, px: 3 }}> {/* Padding reduzido */}
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}> {/* Gap reduzido */}
                            <TextField
                                autoFocus
                                placeholder="Pesquisar por nome ou matrícula"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                size="small" // Adicionado size="small" para compactar
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                            {filteredStudents.length > 0 && (
                                <Paper sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    <List dense> {/* Lista mais compacta */}
                                        {filteredStudents.map(student => (
                                            <ListItemButton key={student.id} onClick={() => handleSelectStudent(student)}>
                                                <ListItemText 
                                                    primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>{student.nome}</Typography>} 
                                                    secondary={<Typography variant="caption">{`Matrícula: ${student.matricula}`}</Typography>} 
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px', justifyContent: 'flex-end' }}> {/* Padding reduzido */}
                         <Button 
                            onClick={handleCancel} 
                            variant="contained" 
                            size="small" // Reduzido o botão
                            sx={{ 
                                backgroundColor: '#343a40', 
                                color: 'white', 
                                '&:hover': { backgroundColor: '#23272b' }, 
                                fontWeight: 'bold', 
                                // REMOVIDO tamanho fixo
                            }}
                        >
                            Cancelar
                        </Button>
                    </DialogActions>
                </>
            )}

            {/* ----------------- STEP 2: CONFIRMAÇÃO ----------------- */}
            {step === 2 && selectedStudent && (
                <>
                    <DialogContent sx={{ pt: 1, pb: 0, px: 3 }}> {/* Padding reduzido */}
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}> {/* Gap reduzido */}
                            
                            {/* CAIXA DE EXPIRAÇÃO */}
                            <Box sx={{ width: '100%', border: '1px solid #ccc', borderRadius: 2, p: 1, textAlign: 'left' }}> {/* Padding reduzido */}
                                <FormLabel sx={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Data de expiração atual</FormLabel>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {/* Fonte reduzida */}
                                    {selectedStudent.data_expiracao}
                                </Typography>
                            </Box>

                            {/* DADOS DO ALUNO */}
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', // Alterado para coluna para melhor quebra no 420px
                                justifyContent: 'flex-start',
                                flexWrap: 'nowrap', 
                                gap: 1, // Reduzido o gap
                                width: '100%',
                                mt: 0 
                            }}>
                                <Typography variant="body2"> {/* Fonte reduzida */}
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Aluno(A): </Box>
                                    {selectedStudent.nome}
                                </Typography>
                                <Typography variant="body2"> {/* Fonte reduzida */}
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Matrícula: </Box>
                                    {selectedStudent.matricula}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                     <DialogActions sx={{ p: '24px', justifyContent: 'flex-end', gap: 2 }}>
                         <Button 
                            onClick={handleCancel} 
                            variant="contained" 
                            sx={{ 
                                backgroundColor: '#343a40', 
                                color: 'white', 
                                '&:hover': { backgroundColor: '#23272b' }, 
                                fontWeight: 'bold',
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleRenovar} 
                            variant="contained" 
                            sx={{ 
                                backgroundColor: '#F2D95C', 
                                color: 'black', 
                                '&:hover': { backgroundColor: '#e0c850' }, 
                                fontWeight: 'bold',
                            }}
                        >
                            Renovar + 30 dias
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}