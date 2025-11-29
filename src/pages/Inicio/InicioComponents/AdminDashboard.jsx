import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Stack, Button, Grid } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";

import * as alunosApi from "../../../services/alunosApiService";
import * as planosApi from "../../../services/planosApiService";

import CadastroAlunoDialog from "../../Alunos/AlunosComponents/CadastroAlunoDialog";
import ItemDialog from '../../Financeiro/FinanceiroComponents/ItemDialog';

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
  const [isReceitaDialogOpen, setIsReceitaDialogOpen] = useState(false);
  const [isDespesaDialogOpen, setIsDespesaDialogOpen] = useState(false);
  
  const [listaPlanos, setListaPlanos] = useState([]);

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await planosApi.getPlanos();
        setListaPlanos(response.data);
      } catch (error) {
        console.error("Erro ao buscar planos para o dashboard:", error);
      }
    };
    fetchPlanos();
  }, []);

  const shortcutButtonStyle = {
    borderRadius: 50,
    bgcolor: '#F2D95C',
    color: '#111',
    fontWeight: 'normal',
    padding: '8px 20px',
    '&:hover': { bgcolor: '#e0c850' },
    whiteSpace: 'nowrap',
    flexGrow: 1,
    textTransform: 'uppercase',
  };

  const handleSaveAluno = async (novoAluno) => {
    try {
      const payload = {
        matricula: novoAluno.matricula,
        nome_aluno: novoAluno.nome,
        email_aluno: novoAluno.email,
        cpf_aluno: novoAluno.cpf,
        cod_plano: novoAluno.cod_plano,
        data_nascimento: novoAluno.dataNascimento,
        telefone: novoAluno.telefone,
        logradouro: novoAluno.endereco,
        numero: "S/N",
        status_aluno: "Ativo",
        genero: novoAluno.genero,
      };

      await alunosApi.createAluno(payload);
      alert("Aluno cadastrado com sucesso via Dashboard!");
      setIsAlunoDialogOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.details?.join("\n") ||
        err.response?.data?.message ||
        "Erro ao cadastrar aluno.";
      alert(`Erro: ${msg}`);
    }
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
          <StatCard title="Despesas esse mês" value="297" color="#ff0000ff" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Resultado no mês" value="297" color="black" />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="normal" gutterBottom sx={{ mt: 4 }}>
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
        <Stack direction={{ xs: 'column', sm: 'row', }} spacing={2}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={shortcutButtonStyle}
            onClick={() => setIsReceitaDialogOpen(true)}
          >
            Registrar Receita
          </Button>

          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={shortcutButtonStyle}
            onClick={() => setIsDespesaDialogOpen(true)}
          >
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
        </Stack>
      </Paper>

      <CadastroAlunoDialog
        open={isAlunoDialogOpen}
        onClose={() => setIsAlunoDialogOpen(false)}
        onSave={handleSaveAluno}
        listaPlanos={listaPlanos}
      />
      <ItemDialog
        open={isReceitaDialogOpen}
        onClose={() => setIsReceitaDialogOpen(false)}
        isRecipe={true}
        title="Registrar Receita"
      />
      <ItemDialog
        open={isDespesaDialogOpen}
        onClose={() => setIsDespesaDialogOpen(false)}
        isRecipe={false}
        title="Registrar Despesa"
      />
    </Box>
  );
}