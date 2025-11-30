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
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as alunosApi from "../../services/alunosApiService";
import * as planosApi from "../../services/planosApiService";
import CadastroAlunoDialog from "./AlunosComponents/CadastroAlunoDialog.jsx";
import EditarAlunoDialog from "./AlunosComponents/EditarAlunoDialog.jsx";
import ExcluirAlunoDialog from "./AlunosComponents/ExcluirAlunoDialog.jsx";

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
  { id: "status", label: "Status", align: "left" },
  { id: "data_expiracao", label: "Data de Expiração", align: "center" },
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

  const address = row.endereco
    ? `${row.endereco.logradouro || ""}, ${row.endereco.numero || ""}`
    : "Não informado";
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
        <Grid item xs={12} sm={6} md={4}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textTransform: "uppercase" }}
          >
            Endereço
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {address}
          </Typography>
        </Grid>
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
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [openRowId, setOpenRowId] = useState(null);


  const [statusFilter, setStatusFilter] = useState("Todos");
  const [anchorElReport, setAnchorElReport] = useState(null);

  const loadData = async () => {
    try {
      const [resPlanos, resAlunos] = await Promise.all([
        planosApi.getPlanos(),
        alunosApi.getAlunos(),
      ]);

      setListaPlanos(resPlanos.data);

      const alunosFormatados = resAlunos.data.map((a) => {
        const dataNasc = a.data_nascimento
          ? new Date(a.data_nascimento).toLocaleDateString("pt-BR")
          : "-";
        const dataMatr = a.created_at
          ? new Date(a.created_at).toLocaleDateString("pt-BR")
          : "-";

        return createStudentData(
          a.matricula,
          a.nome_aluno,
          a.matricula,
          a.nome_plano || "Plano não encontrado",
          a.cod_plano,
          dataMatr,
          "-",
          a.status_aluno,
          {
            email: a.email_aluno,
            cpf: a.cpf_aluno,
            telefone: a.telefone,
            dataNascimento: dataNasc,
            genero: a.genero || "Não informado",
            endereco: {
              logradouro: a.logradouro,
              numero: a.numero,
            },
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
    if (statusFilter !== "Todos") {
      tempRows = tempRows.filter((row) => row.status === statusFilter);
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tempRows = tempRows.filter(
        (row) =>
          row.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
          row.matricula.includes(searchTerm)
      );
    }
    return tempRows;
  }, [searchTerm, statusFilter, rows]);

  const handleAddAlunoClick = () => setCadastroOpen(true);
  const handleEdit = (id) => {
    const aluno = rows.find((row) => row.id === id);
    setAlunoSelecionado(aluno);
    setEditOpen(true);
  };
  const handleDelete = (id) => {
    const aluno = rows.find((row) => row.id === id);
    setAlunoSelecionado(aluno);
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
        logradouro: novoAluno.endereco,
        numero: "S/N",
        status_aluno: "Ativo",
        genero: novoAluno.genero,
      };

      await alunosApi.createAluno(payload);
      alert("Aluno cadastrado com sucesso!");
      loadData();
      setCadastroOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.details?.join("\n") ||
        err.response?.data?.message ||
        "Erro ao cadastrar.";
      alert(`Erro: ${msg}`);
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
        logradouro: alunoEditado.endereco,
        genero: alunoEditado.genero,
        status_aluno: alunoEditado.status || "Ativo",
      };

      await alunosApi.updateAluno(alunoEditado.id, payload);

      alert("Aluno atualizado com sucesso!");
      loadData();
      setEditOpen(false);
      setAlunoSelecionado(null);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.details?.join("\n") ||
        err.response?.data?.message ||
        "Erro ao editar.";
      alert(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (alunoSelecionado) {
      try {
        await alunosApi.deleteAluno(alunoSelecionado.id);
        alert("Aluno excluído com sucesso!");
        loadData();
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao excluir.";
        alert(msg);
      }
    }
    setDeleteOpen(false);
    setAlunoSelecionado(null);
  };

  const handleReportMenuClick = (event) =>
    setAnchorElReport(event.currentTarget);
  const handleReportMenuClose = () => setAnchorElReport(null);
  const handleDownloadReport = async (reportType) => {
    handleReportMenuClose();
    let dataToExport = [];
    let reportTitle = "Relatório de Alunos";
    let apiCallFunction;
    let isDetailed = reportType.includes("detalhado");
    let filterType = reportType.split("-")[0];

    switch (filterType) {
      case "ativos":
        dataToExport = rows.filter((row) => row.status === "Ativo");
        break;
      case "inativos":
        dataToExport = rows.filter((row) => row.status === "Inativo");
        break;
      case "todos":
      default:
        dataToExport = rows;
        break;
    }

    reportTitle = `Relatório de Alunos (${filterType.charAt(0).toUpperCase() + filterType.slice(1)})`;
    if (isDetailed) reportTitle += " - Detalhado";

    if (isDetailed) {
      apiCallFunction = () =>
        window.electronAPI.generateDetailedStudentReport(dataToExport);
    } else {
      const reportOptions = {
        title: reportTitle,
        defaultFileName: `relatorio_alunos_${filterType}.pdf`,
        headers: ["Nome", "Matrícula", "Plano", "Status", "Expiração"],
        columnWidths: [240, 100, 120, 100, 100],
        data: dataToExport.map((row) => [
          row.nome,
          row.matricula,
          row.plano,
          row.status,
          row.data_expiracao,
        ]),
      };
      apiCallFunction = () => window.electronAPI.generateReport(reportOptions);
    }

    try {
      const result = await apiCallFunction();
      if (result.success) alert(`Relatório salvo: ${result.path}`);
    } catch (error) {
      alert(`Erro ao gerar relatório: ${error.message}`);
    }
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
            placeholder="Pesquisar por Nome ou Matrícula do Aluno"
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
              fontWeight: "normal",
              borderRadius: "25px",
            }}
          >
            Relatórios
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={handleAddAlunoClick}
            sx={{
              backgroundColor: "#F2D95C",
              color: "black",
              "&:hover": { backgroundColor: "#e0c850" },
              fontWeight: "normal",
              borderRadius: "25px",
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
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        }}
                      >
                        {studentColumns.map((column) => {
                          const value = row[column.id];

                          if (column.id === "expand") {
                            return (
                              <TableCell
                                padding="checkbox"
                                sx={{ width: column.width }}
                              >
                                <IconButton
                                  aria-label="expand row"
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

                          let cellContent = value;
                          if (column.id === "actions") {
                            cellContent = (
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
                            );
                          }
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align || "left"}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={7}
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