import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  Chip,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as alunosApi from "../../services/alunosApiService";
import * as planosApi from "../../services/planosApiService";
import CadastroAlunoDialog from "./AlunosComponents/CadastroAlunoDialog.jsx";
import EditarAlunoDialog from "./AlunosComponents/EditarAlunoDialog.jsx";
import ExcluirAlunoDialog from "./AlunosComponents/ExcluirAlunoDialog.jsx";
import RenovarPlanoDialog from "./AlunosComponents/RenovarPlanoDialog.jsx";

const formatarData = (dataString) => {
  if (!dataString) return "-";
  if (dataString === "Sem Plano" || dataString === "Expirado")
    return dataString;

  const data = new Date(dataString);
  if (isNaN(data.getTime())) return "-";
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const createStudentData = (
  id,
  nome,
  matricula,
  plano,
  cod_plano,
  data_matricula,
  data_expiracao,
  status,
  outrosDados = {}
) => {
  return {
    id,
    nome,
    matricula,
    plano,
    cod_plano,
    data_matricula,
    data_expiracao,
    status,
    ...outrosDados,
  };
};

const studentColumns = [
  { id: "expand", label: "", width: "10px" },
  { id: "nome", label: "Nome do Aluno" },
  { id: "matricula", label: "Matrícula" },
  { id: "plano", label: "Plano" },
  { id: "status", label: "Status", align: "center" },
  { id: "data_expiracao", label: "Vencimento", align: "center" },
  { id: "actions", label: "Ação", align: "center" },
];

const DetailItem = ({ title, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", textTransform: "uppercase" }}
    >
      {title}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {value || "Não informado"}
    </Typography>
  </Grid>
);

function RowDetails({ row }) {
  const logradouroBD = row.endereco?.logradouro || "";
  const partes = logradouroBD
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let logradouroDisplay = "Não informado";
  let bairroDisplay = "Não informado";
  if (partes.length >= 2) {
    logradouroDisplay = partes[0];
    bairroDisplay = partes[1];
  } else if (partes.length === 1) {
    logradouroDisplay = "Não informado";
    bairroDisplay = partes[0];
  }

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: 2,
        m: 1,
        border: "1px solid #eee",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Detalhes do Aluno
      </Typography>
      <Grid container spacing={2}>
        <DetailItem title="CPF" value={row.cpf} />
        <DetailItem title="Gênero" value={row.genero} />
        <DetailItem title="Data de Nasc." value={row.dataNascimento} />
        <DetailItem title="Email" value={row.email} />
        <DetailItem title="Telefone" value={row.telefone} />
        <DetailItem title="Endereço" value={logradouroDisplay} />
        <DetailItem title="Bairro" value={bairroDisplay} />
        <DetailItem title="Número" value={row.endereco?.numero} />
        <DetailItem title="Data de Registro" value={row.data_matricula} />
      </Grid>
    </Box>
  );
}

const blackFocusedStyle = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "black" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#343a40",
  },
};

export default function AlunosPage() {
  const [rows, setRows] = useState([]);
  const [listaPlanos, setListaPlanos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renovarOpen, setRenovarOpen] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [openRowId, setOpenRowId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [anchorElReport, setAnchorElReport] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const loadData = async () => {
    try {
      const [resPlanos, resAlunos] = await Promise.all([
        planosApi.getPlanos(),
        alunosApi.getAlunos(),
      ]);
      setListaPlanos(resPlanos.data);

      const alunosFormatados = resAlunos.data.map((a) => {
        const dataNasc = formatarData(a.data_nascimento);
        const dataMatr = formatarData(a.created_at);
        const dataExpiracao =
          a.data_expiracao_formatada || formatarData(a.data_expiracao);

        return createStudentData(
          a.matricula,
          a.nome_aluno,
          a.matricula,
          a.nome_plano || "Sem Plano",
          a.cod_plano,
          dataMatr,
          dataExpiracao,
          a.status_aluno,
          {
            email: a.email_aluno,
            cpf: a.cpf_aluno,
            telefone: a.telefone,
            dataNascimento: dataNasc,
            genero: a.genero || "Não informado",
            endereco: { logradouro: a.logradouro, numero: a.numero },
          }
        );
      });
      setRows(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    let tempRows = rows;
    if (statusFilter !== "Todos")
      tempRows = tempRows.filter((row) => row.status === statusFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      tempRows = tempRows.filter(
        (row) =>
          row.nome.toLowerCase().includes(lower) ||
          row.matricula.includes(searchTerm)
      );
    }
    return tempRows;
  }, [searchTerm, statusFilter, rows]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.matricula);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleClickCheckbox = (event, matricula) => {
    const selectedIndex = selectedIds.indexOf(matricula);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, matricula);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  const isSelected = (matricula) => selectedIds.indexOf(matricula) !== -1;

  const handleRenovarClick = () => {
    if (selectedIds.length === 0)
      return alert("Selecione pelo menos um aluno.");
    setRenovarOpen(true);
  };

  const handleConfirmRenovacao = async (codPlano) => {
    try {
      await alunosApi.renovarPlano({
        matriculas: selectedIds,
        cod_plano: codPlano,
      });
      alert("Renovação realizada com sucesso!");
      setRenovarOpen(false);
      setSelectedIds([]);
      loadData();
    } catch (err) {
      alert(`Erro ao renovar: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleAddAlunoClick = () => setCadastroOpen(true);
  const handleEdit = (id) => {
    setAlunoSelecionado(rows.find((row) => row.id === id));
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    setAlunoSelecionado(rows.find((row) => row.id === id));
    setDeleteOpen(true);
  };

  const handleCloseDialogs = () => {
    setCadastroOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setTimeout(() => setAlunoSelecionado(null), 300);
  };

  const handleSaveNovoAluno = async (novoAluno) => {
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
      alert("Aluno cadastrado com sucesso!");
      loadData();
      setCadastroOpen(false);
    } catch (err) {
      alert(`Erro: ${err.response?.data?.message || "Erro ao cadastrar."}`);
    }
  };

  const handleSaveEdicao = async (alunoEditado) => {
    try {
      const payload = {
        matricula: alunoEditado.id,
        nome_aluno: alunoEditado.nome,
        email_aluno: alunoEditado.email,
        cpf_aluno: alunoEditado.cpf,
        cod_plano: alunoEditado.cod_plano,
        data_nascimento: alunoEditado.dataNascimento,
        telefone: alunoEditado.telefone,
        logradouro: alunoEditado.logradouro,
        numero: alunoEditado.numero || "S/N",
        genero: alunoEditado.genero,
        status_aluno: alunoEditado.status,
      };
      await alunosApi.updateAluno(alunoEditado.id, payload);
      alert("Aluno atualizado!");
      loadData();
      setEditOpen(false);
      setAlunoSelecionado(null);
    } catch (err) {
      alert("Erro ao editar.");
    }
  };

  const handleConfirmDelete = async () => {
    if (alunoSelecionado) {
      if (alunoSelecionado.status === "Ativo") {
        alert("Não é permitido excluir um aluno Ativo. Inative-o primeiro.");
        setDeleteOpen(false);
        setAlunoSelecionado(null);
        return;
      }

      try {
        await alunosApi.deleteAluno(alunoSelecionado.id);
        alert("Aluno excluído!");
        loadData();
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
    setDeleteOpen(false);
    setAlunoSelecionado(null);
  };

  const handleReportMenuClick = (event) =>
    setAnchorElReport(event.currentTarget);
  const handleReportMenuClose = () => setAnchorElReport(null);
  const handleDownloadReport = async () => {
    handleReportMenuClose();
    alert("Relatório em breve...");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Gerenciamento de Alunos
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "400px", ...blackFocusedStyle }}
          />
          <FormControl
            size="small"
            sx={{ minWidth: 180, ...blackFocusedStyle }}
          >
            <InputLabel>Filtrar por Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filtrar por Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleReportMenuClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              color: "text.secondary",
              borderColor: "grey.400",
              borderRadius: "25px",
            }}
          >
            Relatórios
          </Button>

          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              startIcon={<AutorenewIcon />}
              onClick={handleRenovarClick}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "25px",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Renovar ({selectedIds.length})
            </Button>
          )}

          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={handleAddAlunoClick}
            sx={{
              backgroundColor: "#F2D95C",
              color: "black",
              borderRadius: "25px",
              "&:hover": { backgroundColor: "#e0c850" },
            }}
          >
            Novo Aluno
          </Button>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < filteredRows.length
                    }
                    checked={
                      filteredRows.length > 0 &&
                      selectedIds.length === filteredRows.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {studentColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#fff",
                      width: column.width,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isRowOpen = openRowId === row.id;
                  const isItemSelected = isSelected(row.matricula);

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) =>
                              handleClickCheckbox(event, row.matricula)
                            }
                          />
                        </TableCell>

                        {studentColumns.map((column) => {
                          const value = row[column.id];
                          if (column.id === "expand") {
                            return (
                              <TableCell
                                padding="checkbox"
                                sx={{ width: column.width }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setOpenRowId(isRowOpen ? null : row.id)
                                  }
                                >
                                  {isRowOpen ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                            );
                          }
                          if (column.id === "status") {
                            const isAtivo = value === "Ativo";
                            return (
                              <TableCell key={column.id} align="center">
                                <Chip
                                  label={value}
                                  size="small"
                                  sx={{
                                    backgroundColor: isAtivo
                                      ? "#e8f5e9"
                                      : "#ffebee",
                                    color: isAtivo ? "#2e7d32" : "#c62828",
                                    fontWeight: "bold",
                                    border: `1px solid ${isAtivo ? "#a5d6a7" : "#ef9a9a"}`,
                                  }}
                                />
                              </TableCell>
                            );
                          }
                          if (column.id === "data_expiracao") {
                            const isExpired = value === "Expirado";
                            return (
                              <TableCell key={column.id} align="center">
                                <Typography
                                  variant="body2"
                                  color={isExpired ? "error" : "textPrimary"}
                                  fontWeight={isExpired ? "bold" : "regular"}
                                >
                                  {value}
                                </Typography>
                              </TableCell>
                            );
                          }

                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id} align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 0.5,
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(row.id)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(row.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align || "left"}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={8}
                        >
                          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
                            <RowDetails row={row} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Alunos por página:"
          sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
        />
      </Paper>

      <CadastroAlunoDialog
        open={cadastroOpen}
        onClose={handleCloseDialogs}
        onSave={handleSaveNovoAluno}
        listaPlanos={listaPlanos}
      />
      <EditarAlunoDialog
        open={editOpen}
        onClose={handleCloseDialogs}
        onSave={handleSaveEdicao}
        alunoParaEditar={alunoSelecionado}
        listaPlanos={listaPlanos}
      />
      <ExcluirAlunoDialog
        open={deleteOpen}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        alunoParaExcluir={alunoSelecionado}
      />

      <RenovarPlanoDialog
        open={renovarOpen}
        onClose={() => setRenovarOpen(false)}
        onConfirm={handleConfirmRenovacao}
        listaPlanos={listaPlanos}
      />

      <Menu
        anchorEl={anchorElReport}
        open={Boolean(anchorElReport)}
        onClose={handleReportMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleDownloadReport("todos")}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          Todos os Alunos
        </MenuItem>
      </Menu>
    </Paper>
  );
}