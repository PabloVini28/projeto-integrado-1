import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import * as alunosApi from "../../services/alunosApiService";
import * as patrimonioApi from "../../services/patrimonioApiService";
import * as planosApi from "../../services/planosApiService";

import CadastroAlunoDialog from "../Alunos/AlunosComponents/CadastroAlunoDialog";
import ItemDialog from "../Patrimonio/PatrimonioComponents/ItemDialog";
import AdminDashboard from "./InicioComponents/AdminDashboard";

const FuncionarioDashboard = () => {
  const navigate = useNavigate();

  const [isAlunoDialogOpen, setIsAlunoDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  const [totalAlunosAtivos, setTotalAlunosAtivos] = useState(0);
  const [listaPlanos, setListaPlanos] = useState([]);

  const [dialogKey, setDialogKey] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchDashboardData = async () => {
    try {
      const responseAlunos = await alunosApi.getAlunos();
      const alunos = responseAlunos.data || [];
      const ativos = alunos.filter((a) => a.status_aluno === "Ativo").length;
      setTotalAlunosAtivos(ativos);

      const responsePlanos = await planosApi.getPlanos();
      setListaPlanos(responsePlanos.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      showSnackbar("Erro ao atualizar dados do painel.", "error");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const shortcutButtonStyle = {
    borderRadius: 50,
    bgcolor: "#F2D95C",
    color: "#111",
    fontWeight: "normal",
    padding: "8px 20px",
    "&:hover": { bgcolor: "#e0c850" },
    whiteSpace: "nowrap",
    flexGrow: 1,
    textTransform: "uppercase",
  };

  const handleOpenAlunoDialog = () => {
    setDialogKey((prev) => prev + 1);
    setIsAlunoDialogOpen(true);
  };

  const handleOpenItemDialog = () => {
    setDialogKey((prev) => prev + 1);
    setIsItemDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setIsAlunoDialogOpen(false);
    setIsItemDialogOpen(false);
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
        logradouro: novoAluno.logradouro,
        numero: novoAluno.numero || "S/N",
        genero: novoAluno.genero,
      };
      await alunosApi.createAluno(payload);
      await fetchDashboardData(); r
      setIsAlunoDialogOpen(false);
      showSnackbar("Aluno cadastrado com sucesso!", "success");
    } catch (err) {
      showSnackbar(
        `Erro: ${err.response?.data?.message || "Erro ao cadastrar aluno."}`,
        "error"
      );
    }
  };

  const handleSaveItem = async (novoItem) => {
    try {
      await patrimonioApi.createPatrimonio(novoItem);
      setIsItemDialogOpen(false);
      showSnackbar("Item registrado com sucesso!", "success");
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Erro ao registrar item.";
      showSnackbar(msg, "error");
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
          marginTop: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "success.main",
                borderRadius: "50%",
              }}
            />
            <Typography variant="h6" color="text.secondary">
              Alunos Ativos
            </Typography>
          </Box>
          <Typography variant="h2" fontWeight="bold">
            {totalAlunosAtivos}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" fontWeight="normal" gutterBottom sx={{ mt: 4 }}>
        Atalhos rápidos
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          padding: 3,
          borderRadius: 4,
          marginTop: 2,
        }}
      >
        <Stack direction={{ sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            sx={shortcutButtonStyle}
            onClick={() => navigate("/planos")}
          >
            Visualizar Planos
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={shortcutButtonStyle}
            onClick={handleOpenItemDialog}
          >
            Registrar Novo Item
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={shortcutButtonStyle}
            onClick={handleOpenAlunoDialog}
          >
            Cadastrar Novo Aluno
          </Button>
        </Stack>
      </Paper>

      {isAlunoDialogOpen && (
        <CadastroAlunoDialog
          key={`aluno-${dialogKey}`}
          open={isAlunoDialogOpen}
          onClose={handleCloseDialogs}
          onSave={handleSaveAluno}
          listaPlanos={listaPlanos}
        />
      )}

      {isItemDialogOpen && (
        <ItemDialog
          key={`item-${dialogKey}`}
          open={isItemDialogOpen}
          onClose={handleCloseDialogs}
          onSave={handleSaveItem}
          title="Registrar Novo Item"
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            width: "100%",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: 3,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default function HomePage() {
  const storedData = localStorage.getItem("userData");
  let userRole = "funcionario";

  if (storedData) {
    const parsed = JSON.parse(storedData);

    if (parsed.nivel_acesso) {
      userRole = parsed.nivel_acesso
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
  }

  if (userRole.includes("admin")) {
    return <AdminDashboard />;
  }

  return <FuncionarioDashboard />;
}