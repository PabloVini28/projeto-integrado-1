import React, { useState } from 'react';
import { Typography, Box, Paper, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from 'react-router-dom';

import CadastroAlunoDialog from '../Alunos/AlunosComponents/CadastroAlunoDialog'; 
import ItemDialog from '../Patrimonio/PatrimonioComponents/ItemDialog';
import RenovarMensalidadeDialog from '../Alunos/AlunosComponents/RenovarMensalidadeDialog';
import AdminDashboard from './InicioComponents/AdminDashboard';

const FuncionarioDashboard = () => {
    const navigate = useNavigate(); 
    const [isAlunoDialogOpen, setIsAlunoDialogOpen] = useState(false);
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [isRenovarDialogOpen, setIsRenovarDialogOpen] = useState(false);

    const alunosExemplo = [
        { id: 1, nome: 'Gabriel Pereira de Souza', matricula: '25010', data_expiracao: '15/08/2025' },
        { id: 2, nome: 'Ana Clara Souza', matricula: '25102', data_expiracao: '20/07/2025' },
        { id: 3, nome: 'Guilherme Santos Rodrigues', matricula: '24891', data_expiracao: '05/09/2025' },
    ];

    const shortcutButtonStyle = {
        borderRadius: 50, 
        bgcolor: '#F2D95C',
        color: '#111', 
        fontWeight: 'bold',
        padding: '8px 20px', 
        '&:hover': {
            bgcolor: '#e0c850', 
        },
        whiteSpace: 'nowrap',
    };

    const handleSaveAluno = (novoAluno) => {
        console.log("Novo aluno cadastrado:", novoAluno);
        setIsAlunoDialogOpen(false);
    };
    const handleCloseAlunoDialog = () => {
        setIsAlunoDialogOpen(false);
    };

    const handleSaveItem = (novoItem) => {
        console.log("Novo item cadastrado:", novoItem);
        setIsItemDialogOpen(false); 
    };
    const handleCloseItemDialog = () => {
        setIsItemDialogOpen(false); 
    };
    const handleRenovarMensalidade = (idAluno) => {
        console.log(`Renovando mensalidade do aluno ID ${idAluno}`);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Visão Geral
            </Typography>

            <Paper
                sx={{
                    padding: 3,
                    borderRadius: 4, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    marginTop: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                bgcolor: 'success.main',
                                borderRadius: '50%',
                            }}
                        />
                        <Typography variant="h6" color="text.secondary">
                            Alunos Ativos
                        </Typography>
                    </Box>
                    <Typography variant="h2" fontWeight="bold">
                        297
                    </Typography>
                </Box>
            </Paper>

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                Atalhos rápidos
            </Typography>

            <Paper
                sx={{
                    padding: 3,
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    marginTop: 2,
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="contained" 
                        sx={shortcutButtonStyle}
                        onClick={() => navigate('/planos')}
                    >
                        Visualizar Planos
                    </Button>
                    <Button 
                        variant="contained" 
                        endIcon={<AddIcon />}
                        sx={shortcutButtonStyle}
                        onClick={() => setIsItemDialogOpen(true)}
                    >
                        Registrar Novo Item
                    </Button>
                    <Button 
                        variant="contained" 
                        endIcon={<AddIcon />}
                        sx={shortcutButtonStyle}
                        onClick={() => setIsAlunoDialogOpen(true)}
                    >
                        Cadastrar Novo Aluno
                    </Button>
                    <Button 
                        variant="contained" 
                        endIcon={<CachedIcon />}
                        sx={shortcutButtonStyle}
                        onClick={() => setIsRenovarDialogOpen(true)}
                    >
                        Renovar Mensalidade
                    </Button>
                </Stack>
            </Paper>

            <CadastroAlunoDialog
                open={isAlunoDialogOpen}
                onClose={handleCloseAlunoDialog}
                onSave={handleSaveAluno}
            />
            <ItemDialog
                open={isItemDialogOpen}
                onClose={handleCloseItemDialog}
                onSave={handleSaveItem}
            />
            <RenovarMensalidadeDialog
                open={isRenovarDialogOpen}
                onClose={() => setIsRenovarDialogOpen(false)}
                onRenovar={handleRenovarMensalidade}
                studentList={alunosExemplo}
            />
        </Box>
    );
};


export default function HomePage() {
    
    // Decisão do que mostrar (adm ou funcionario)
    const userRole = 'admin'; //  'funcionario' para ver o outro layout

    if (userRole === 'admin') {
        return <AdminDashboard />;
    }
    
    return <FuncionarioDashboard />;
}