import React, { useState, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';

import FinanceTable from "./FinanceiroComponents/FinanceTable.jsx";
import ItemDialog from "./FinanceiroComponents/ItemDialog.jsx";
import ConfirmaDialog from "./FinanceiroComponents/ConfirmaDialog.jsx";
import VisaoGeralPainel from "./FinanceiroComponents/VisaoGeralPainel.jsx"; // Importa o componente 1
import MenuRelatorios from "./FinanceiroComponents/MenuRelatorios.jsx"; // Importa o componente 2


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      <Box sx={{ pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </Box>
    </div>
  );
}

const receitasData = [
  { id: 1, nome: 'Mensalidade', data: '01/11/2025', descricao: "Ref. Gabriel", categoria: "Alunos", valor: 80.0, nome_aluno: "Gabriel P. Souza" },
  { id: 2, nome: 'Mensalidade', data: '01/11/2025', descricao: "Ref. Ana Clara", categoria: "Alunos", valor: 80.0, nome_aluno: "Ana Clara Souza" },
  { id: 3, nome: 'Aluguel Loja', data: '02/11/2025', descricao: "Aluguel Loja 03", categoria: "Outras", valor: 1200.0 },
  { id: 6, nome: 'Mensalidade', data: '03/11/2025', descricao: "Ref. Júlia", categoria: "Alunos", valor: 150.0, nome_aluno: "Júlia A. Ribeiro" },
  { id: 7, nome: 'Taxa Matrícula', data: '04/11/2025', descricao: "Taxa Matrícula - Gui", categoria: "Alunos", valor: 50.0, nome_aluno: "Guilherme S. Rodrigues" },
  { id: 8, nome: 'Venda Suplemento', data: '05/11/2025', descricao: "Venda de Whey", categoria: "Outras", valor: 250.0 },
];

const despesasData = [
  { id: 10, nome: 'Água', data: '02/11/2025', descricao: "Pagamento conta de água", categoria: "Contas Fixas", valor: 100.0 },
  { id: 11, nome: 'Aluguel', data: '05/11/2025', descricao: "Pagamento aluguel", categoria: "Contas Fixas", valor: 1200.0 },
  { id: 12, nome: 'Energia', data: '06/11/2025', descricao: "Pagamento conta de energia", categoria: "Contas Fixas", valor: 500.0 },
  { id: 13, nome: 'Manutenção Esteira', data: '07/11/2025', descricao: "Concerto esteira 02", categoria: "Manutenção", valor: 350.0 },
  { id: 14, nome: 'Compra Halteres', data: '08/11/2025', descricao: "Kit halteres 1-10kg", categoria: "Patrimônio", valor: 800.0 },
];

export default function FinanceiroPage() {
  const [receitasPage, setReceitasPage] = useState(0);
  const [despesasPage, setDespesasPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCurrentRecipe, setIsCurrentRecipe] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [receitaSearch, setReceitaSearch] = useState('');
  const [receitaCategory, setReceitaCategory] = useState('Todas');
  const [despesaSearch, setDespesaSearch] = useState('');
  const [despesaCategory, setDespesaCategory] = useState('Todas');

  const { receitasAlunos, outrasReceitas, despesas, resultado } = useMemo(() => {
    const rAlunos = receitasData.filter(r => r.categoria === 'Alunos').reduce((acc, r) => acc + r.valor, 0);
    const rOutras = receitasData.filter(r => r.categoria !== 'Alunos').reduce((acc, r) => acc + r.valor, 0);
    const rDespesas = despesasData.reduce((acc, r) => acc + r.valor, 0);
    const saldoTotal = rAlunos + rOutras - rDespesas;
    return { 
        receitasAlunos: `R$ ${rAlunos.toFixed(2).replace(".", ",")}`,
        outrasReceitas: `R$ ${rOutras.toFixed(2).replace(".", ",")}`,
        despesas: `R$ ${rDespesas.toFixed(2).replace(".", ",")}`,
        resultado: `R$ ${saldoTotal.toFixed(2).replace(".", ",")}`
    };
  }, [receitasData, despesasData]);

  const handleReceitasPageChange = (event, newPage) => setReceitasPage(newPage);
  const handleDespesasPageChange = (event, newPage) => setDespesasPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setReceitasPage(0);
    setDespesasPage(0);
  };

  const handleOpenAdd = (isRecipe) => {
    setIsCurrentRecipe(isRecipe);
    setCurrentItem(null);
    setIsAddDialogOpen(true);
  };
  const handleEdit = (item, isRecipe) => {
    setIsCurrentRecipe(isRecipe);
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };
  const handleDelete = (id, isRecipe) => {
    setItemToDelete({ id, type: isRecipe ? "Receita" : "Despesa" });
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    console.log(`Excluindo ${itemToDelete.type} com ID: ${itemToDelete.id}`);
    handleCloseDialogs();
  };
  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
    setItemToDelete(null);
  };
  const handleSaveNewItem = (data) => {
    console.log(`Salvando NOVA Transação (${data.type}):`, data);
    handleCloseDialogs();
  };
  const handleUpdateItem = (data) => {
    console.log(
      `Atualizando Transação (${data.type}) com ID ${currentItem?.id}:`,
      data
    );
    handleCloseDialogs();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  
  const handleDownloadReport = async (reportType) => {
      let dataToExport = [];
      let reportTitle = "Relatório Financeiro";
      let headers = ['ID', 'Nome', 'Categoria', 'Aluno', 'Data', 'Descrição', 'Valor (R$)'];
      let columnWidths = [50, 120, 100, 150, 80, 150, 100];
      
      const allData = [
          ...receitasData.map(r => ({...r, valorStr: `+ R$ ${r.valor.toFixed(2)}`})), 
          ...despesasData.map(d => ({...d, valorStr: `- R$ ${d.valor.toFixed(2)}`}))
      ];

      switch(reportType) {
          case 'receitas':
              dataToExport = receitasData.map(r => ({...r, valorStr: `+ R$ ${r.valor.toFixed(2)}`}));
              reportTitle = "Relatório de Receitas";
              break;
          case 'despesas':
              dataToExport = despesasData.map(d => ({...d, valorStr: `- R$ ${d.valor.toFixed(2)}`}));
              reportTitle = "Relatório de Despesas";
              break;
          case 'completo':
          default:
              dataToExport = allData;
              reportTitle = "Relatório Financeiro Completo";
              break;
      }
      
      const reportOptions = {
          title: reportTitle,
          defaultFileName: `relatorio_financeiro_${reportType}.pdf`,
          headers: headers,
          columnWidths: columnWidths, 
          data: dataToExport.map(row => [
              row.id, row.nome || '-', row.categoria || '-', row.nome_aluno || '-',
              row.data || '-', row.descricao || '-', row.valorStr
          ])
      };

      try {
          const result = await window.electronAPI.generateReport(reportOptions);
          if (result.success) {
              alert(`Relatório salvo com sucesso em:\n${result.path}`);
          } else if (result.error !== 'Save dialog canceled') {
              alert(`Falha ao salvar relatório: ${result.error}`);
          }
      } catch (error) {
          alert(`Erro ao gerar relatório: ${error.message}`);
      }
  };

  const filteredReceitas = useMemo(() => {
    let temp = receitasData;
    if (receitaCategory !== 'Todas') {
      temp = temp.filter(r => r.categoria === receitaCategory);
    }
    if (receitaSearch) {
      const search = receitaSearch.toLowerCase();
      temp = temp.filter(r => r.nome.toLowerCase().includes(search) || r.descricao.toLowerCase().includes(search));
    }
    return temp;
  }, [receitasData, receitaSearch, receitaCategory]);

  const filteredDespesas = useMemo(() => {
    let temp = despesasData;
    if (despesaCategory !== 'Todas') {
      temp = temp.filter(d => d.categoria === despesaCategory);
    }
    if (despesaSearch) {
      const search = despesaSearch.toLowerCase();
      temp = temp.filter(d => d.nome.toLowerCase().includes(search) || d.descricao.toLowerCase().includes(search));
    }
    return temp;
  }, [despesasData, despesaSearch, despesaCategory]);


  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold" }}
        >
          Financeiro
        </Typography>
        
        
        <MenuRelatorios
          onDownloadCompleto={() => handleDownloadReport('completo')}
          onDownloadReceitas={() => handleDownloadReport('receitas')}
          onDownloadDespesas={() => handleDownloadReport('despesas')}
        />

      </Box>

      <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Abas do financeiro">
            <Tab label="Visão Geral" id="finance-tab-0" />
            <Tab label="Receitas" id="finance-tab-1" />
            <Tab label="Despesas" id="finance-tab-2" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <VisaoGeralPainel
            receitasAlunos={receitasAlunos}
            outrasReceitas={outrasReceitas}
            despesas={despesas}
            resultado={resultado}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minHeight: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0, flex: '0 0 auto' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                      size="small"
                      placeholder="Pesquisar em receitas..."
                      value={receitaSearch}
                      onChange={(e) => setReceitaSearch(e.target.value)}
                      InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)}}
                      sx={{ width: '300px' }}
                  />
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel>Categoria</InputLabel>
                      <Select value={receitaCategory} label="Categoria" onChange={(e) => setReceitaCategory(e.target.value)}>
                          <MenuItem value="Todas">Todas</MenuItem>
                          <MenuItem value="Alunos">Alunos</MenuItem>
                          <MenuItem value="Outras">Outras</MenuItem>
                      </Select>
                  </FormControl>
              </Box>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => handleOpenAdd(true)}
                sx={{ backgroundColor: "#F2D95C", color: "black", fontWeight: "bold", borderRadius: "50px", "&:hover": { backgroundColor: "#e0c850" }, textTransform: 'uppercase', flex: '0 0 auto' }}
              >
                Registrar Receita
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <FinanceTable
                title=""
                rows={filteredReceitas}
                isRecipe={true}
                page={receitasPage}
                rowsPerPage={rowsPerPage}
                count={filteredReceitas.length}
                onPageChange={handleReceitasPageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minHeight: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0, flex: '0 0 auto' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                      size="small"
                      placeholder="Pesquisar em despesas..."
                      value={despesaSearch}
                      onChange={(e) => setDespesaSearch(e.target.value)}
                      InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)}}
                      sx={{ width: '300px' }}
                  />
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel>Categoria</InputLabel>
                      <Select value={despesaCategory} label="Categoria" onChange={(e) => setDespesaCategory(e.target.value)}>
                          <MenuItem value="Todas">Todas</MenuItem>
                          <MenuItem value="Contas Fixas">Contas Fixas</MenuItem>
                          <MenuItem value="Patrimônio">Patrimônio</MenuItem>
                          <MenuItem value="Manutenção">Manutenção</MenuItem>
                      </Select>
                  </FormControl>
              </Box>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => handleOpenAdd(false)}
                sx={{ backgroundColor: "#F2D95C", color: "black", fontWeight: "bold", borderRadius: "50px", "&:hover": { backgroundColor: "#e0c850" }, textTransform: 'uppercase', flex: '0 0 auto' }}
              >
                Registrar Despesa
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <FinanceTable
                title=""
                rows={filteredDespesas}
                isRecipe={false}
                page={despesasPage}
                rowsPerPage={rowsPerPage}
                count={filteredDespesas.length}
                onPageChange={handleDespesasPageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Box>
          </Box>
        </TabPanel>
      </Box>

      {/* Dialogs */}
      <ItemDialog
        open={isAddDialogOpen}
        onClose={handleCloseDialogs}
        onSave={handleSaveNewItem}
        title={`Adicionar ${isCurrentRecipe ? "Receita" : "Despesa"}`}
        isRecipe={isCurrentRecipe}
      />
      <ItemDialog
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        onSave={handleUpdateItem}
        title={`Editar ${isCurrentRecipe ? "Receita" : "Despesa"}`}
        itemToEdit={currentItem}
        isRecipe={isCurrentRecipe}
      />
      <ConfirmaDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDialogs}
        onConfirm={confirmDelete}
        title={`Tem certeza que deseja excluir esta ${itemToDelete ? itemToDelete.type.toLowerCase() : "transação"}?`}
      />

    </Paper>
  );
}