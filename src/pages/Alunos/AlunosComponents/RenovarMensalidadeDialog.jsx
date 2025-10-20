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
                    maxWidth: '500px',
                } 
            }}
            fullWidth
        >
            <DialogTitle sx={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', pb: 1, pt: 3 }}>
                Renovar mensalidade
            </DialogTitle>

            
            {step === 1 && (
                <>
                    <DialogContent>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                            <TextField
                                autoFocus
                                placeholder="Pesquisar por nome ou matrícula do aluno"
                                value={searchTerm}
                                onChange={handleSearchChange}
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
                                    <List>
                                        {filteredStudents.map(student => (
                                            <ListItemButton key={student.id} onClick={() => handleSelectStudent(student)}>
                                                <ListItemText primary={student.nome} secondary={`Matrícula: ${student.matricula}`} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: '24px', justifyContent: 'flex-start' }}>
                         <Button 
                            onClick={handleCancel} 
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
                    </DialogActions>
                </>
            )}

            {step === 2 && selectedStudent && (
                <>
                    <DialogContent>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            
                            <Box sx={{ width: '100%', border: '1px solid #ccc', borderRadius: 2, p: 1.5, textAlign: 'left' }}>
                                <FormLabel sx={{ fontSize: '0.9rem' }}>Data de expiração atual</FormLabel>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {selectedStudent.data_expiracao}
                                </Typography>
                            </Box>

                            
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexWrap: 'wrap', // Para quebrar linha se a tela for muito pequena
                                gap: 3, // Espaço entre os dois itens
                                width: '100%',
                                mt: 1 
                            }}>
                                <Typography variant="body1">
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Aluno(A): </Box>
                                    {selectedStudent.nome}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Matrícula: </Box>
                                    {selectedStudent.matricula}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                     <DialogActions sx={{ p: '24px', justifyContent: 'flex-start', gap: 2 }}>
                         <Button 
                            onClick={handleCancel} 
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
                            onClick={handleRenovar} 
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
                            Renovar + 30 dias
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}