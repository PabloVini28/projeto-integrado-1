import React, { useState } from 'react';
import { Typography, Box, Paper, Stack, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';

import CadastroAlunoDialog from '../../Alunos/AlunosComponents/CadastroAlunoDialog'; 
import RenovarMensalidadeDialog from '../../Alunos/AlunosComponents/RenovarMensalidadeDialog';

const StatCard = ({ title, value, color }) => (
  <Paper
    variant="outlined" 
    sx={{
      p: 3,
      borderRadius: 3,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="h5" fontWeight="bold">
      <Typography
        component="span"
        variant="h6"
        fontWeight="bold"
        sx={{ color: 'black', mr: 0.5 }}
      >
        R$
      </Typography>
      <Typography
        component="span"
        variant="h5"
        fontWeight="bold"
        sx={{ color: color }}
      >
        {value}
      </Typography>
    </Typography>
  </Paper>
);

export default function AdminDashboard() {
  const [isAlunoDialogOpen, setIsAlunoDialogOpen] = useState(false);
  const [isRenovarDialogOpen, setIsRenovarDialogOpen] = useState(false);
  
  const alunosExemplo = [
    { id: 1, nome: 'Gabriel Pereira de Souza', matricula: '25010', data_expiracao: '15/08/2025' },
  ];

  const shortcutButtonStyle = {
    borderRadius: 50, 
    bgcolor: '#F2D95C',
    color: '#111', 
    fontWeight: 'bold',
    padding: '8px 20px', 
    '&:hover': { bgcolor: '#e0c850' },
    whiteSpace: 'nowrap',
    flexGrow: 1,
    textTransform: 'uppercase',
  };

  const handleSaveAluno = (novoAluno) => {
    console.log("Novo aluno cadastrado:", novoAluno);
    setIsAlunoDialogOpen(false);
  };

  const handleRenovarMensalidade = (idAluno) => {
    console.log(`Renovando mensalidade do aluno ID ${idAluno}`);
    setIsRenovarDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Visão Geral
      </Typography>

      <Paper
        variant="outlined"
        sx={{ 
            padding: 3, 
            borderRadius: 4, 
            marginTop: 2 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%' }} />
            <Typography variant="h6" color="text.secondary">Alunos Ativos</Typography>
          </Box>
          <Typography variant="h2" fontWeight="bold">297</Typography>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Receitas esse mês" value="297" color="green" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Despesas esse mês" value="297" color="#F6A500" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Resultado no mês" value="297" color="#1976d2" />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
        Atalhos rápidos
      </Typography>

      <Paper
        variant="outlined"
        sx={{ 
            padding: 3, 
            borderRadius: 4, 
            marginTop: 2 
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" endIcon={<AddIcon />} sx={shortcutButtonStyle}>
            Registrar Receita
          </Button>
          <Button variant="contained" endIcon={<AddIcon />} sx={shortcutButtonStyle}>
            Registrar Despesa
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
        onClose={() => setIsAlunoDialogOpen(false)}
        onSave={handleSaveAluno}
      />
      <RenovarMensalidadeDialog
        open={isRenovarDialogOpen}
        onClose={() => setIsRenovarDialogOpen(false)}
        onRenovar={handleRenovarMensalidade}
        studentList={alunosExemplo}
      />
    </Box>
  );
}