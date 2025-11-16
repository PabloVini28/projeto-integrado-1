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

// Componentes importados
import FinanceTable from "./FinanceiroComponents/FinanceTable.jsx";
import ItemDialog from "./FinanceiroComponents/ItemDialog.jsx";
import ConfirmaDialog from "./FinanceiroComponents/ConfirmaDialog.jsx";
import VisaoGeralPainel from "./FinanceiroComponents/VisaoGeralPainel.jsx";
import MenuRelatorios from "./FinanceiroComponents/MenuRelatorios.jsx";


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

const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const formatDateToInput = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};


const receitasData = [
  { id: 1, nome: 'Mensalidade', data: '01/11/2025', descricao: "Ref. Gabriel", categoria: "Alunos", valor: 80.0, nome_aluno: "Gabriel P. Souza" },
  { id: 2, nome: 'Mensalidade', data: '01/11/2025', descricao: "Ref. Ana Clara", categoria: "Alunos", valor: 80.0, nome_aluno: "Ana Clara Souza" },
  { id: 3, nome: 'Aluguel Loja', data: '02/11/2025', descricao: "Aluguel Loja 03", categoria: "Outras", valor: 1200.0 },
  { id: 6, nome: 'Mensalidade', data: '03/11/2025', descricao: "Ref. Júlia", categoria: "Alunos", valor: 150.0, nome_aluno: "Júlia A. Ribeiro" },
  { id: 9, nome: 'Mensalidade', data: '01/10/2025', descricao: "Ref. Gabriel (Mês Antigo)", categoria: "Alunos", valor: 80.0, nome_aluno: "Gabriel P. Souza" },
];

const despesasData = [
  { id: 10, nome: 'Água', data: '02/11/2025', descricao: "Pagamento conta de água", categoria: "Outras", valor: 100.0 },
  { id: 11, nome: 'Aluguel', data: '05/11/2025', descricao: "Pagamento aluguel", categoria: "Outras", valor: 1200.0 },
  { id: 12, nome: 'Energia', data: '06/11/2025', descricao: "Pagamento conta de energia", categoria: "Pessoal", valor: 500.0 },
  { id: 15, nome: 'Energia', data: '06/10/2025', descricao: "Pagamento conta de energia (Mês Antigo)", categoria: "Investimento", valor: 480.0 },
];

export default function FinanceiroPage() {
  
  // Mudar 'true' para 'false' para mudar a visão de admin para funcionario
  const [isAdmin, setIsAdmin] = useState(true); 

  const [selectedDate, setSelectedDate] = useState(new Date());
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


  const receitasDoMes = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    return receitasData.filter(item => {
        const itemDate = parseDateString(item.data);
        return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
    });
  }, [receitasData, selectedDate]);

  const despesasDoMes = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    return despesasData.filter(item => {
        const itemDate = parseDateString(item.data);
        return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
    });
  }, [despesasData, selectedDate]);


  const { receitasAlunos, outrasReceitas, despesas, resultado } = useMemo(() => {
    const rAlunos = receitasDoMes.filter(r => r.categoria === 'Alunos').reduce((acc, r) => acc + r.valor, 0);
    const rOutras = receitasDoMes.filter(r => r.categoria !== 'Alunos').reduce((acc, r) => acc + r.valor, 0);
    const rDespesas = despesasDoMes.reduce((acc, r) => acc + r.valor, 0);
    const saldoTotal = rAlunos + rOutras - rDespesas;
    return { 
        receitasAlunos: `R$ ${rAlunos.toFixed(2).replace(".", ",")}`,
        outrasReceitas: `R$ ${rOutras.toFixed(2).replace(".", ",")}`,
        despesas: `R$ ${rDespesas.toFixed(2).replace(".", ",")}`,
        resultado: `R$ ${saldoTotal.toFixed(2).replace(".", ",")}`
    };
  }, [receitasDoMes, despesasDoMes]);


  const filteredReceitas = useMemo(() => {
    let temp = receitasDoMes;
    if (receitaCategory !== 'Todas') {
      temp = temp.filter(r => r.categoria === receitaCategory);
    }
    if (receitaSearch) {
      const search = receitaSearch.toLowerCase();
      temp = temp.filter(r => r.nome.toLowerCase().includes(search) || r.descricao.toLowerCase().includes(search));
    }

    return temp.slice().sort((a, b) => parseDateString(b.data) - parseDateString(a.data));
    
  }, [receitasDoMes, receitaSearch, receitaCategory]);

  const filteredDespesas = useMemo(() => {
    let temp = despesasDoMes;
    if (despesaCategory !== 'Todas') {
      temp = temp.filter(d => d.categoria === despesaCategory);
    }
    if (despesaSearch) {
      const search = despesaSearch.toLowerCase();
      temp = temp.filter(d => d.nome.toLowerCase().includes(search) || d.descricao.toLowerCase().includes(search));
    }

    return temp.slice().sort((a, b) => parseDateString(b.data) - parseDateString(a.data));
  }, [despesasDoMes, despesaSearch, despesaCategory]);

 
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
    console.log(`Atualizando Transação (${data.type}) com ID ${currentItem?.id}:`, data);
    handleCloseDialogs();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (event) => {
      const dateString = event.target.value;
      if (dateString) {
          const [year, month] = dateString.split('-').map(Number);
          setSelectedDate(new Date(year, month - 1, 1));
      } else {
          setSelectedDate(new Date());
      }
  };


  const handleDownloadReport = async (reportType) => {
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
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          mb: 2, 
          gap: 2 
        }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold" }}
        >
          Financeiro
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
                label="Mês/Ano"
                type="month"
                size="small"
                value={formatDateToInput(selectedDate)}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            {isAdmin && (
              <MenuRelatorios
                onDownloadCompleto={() => handleDownloadReport('completo')}
                onDownloadReceitas={() => handleDownloadReport('receitas')}
                onDownloadDespesas={() => handleDownloadReport('despesas')}
              />
            )}
        </Box>
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
          {isAdmin ? (
            <VisaoGeralPainel
              receitasAlunos={receitasAlunos}
              outrasReceitas={outrasReceitas}
              despesas={despesas}
              resultado={resultado}
            />
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              A visão geral é restrita a administradores.
            </Typography>
          )}
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
                sx={{ backgroundColor: "#F2D95C", color: "black", fontWeight: "normal", borderRadius: "50px", "&:hover": { backgroundColor: "#e0c850" }, textTransform: 'uppercase', flex: '0 0 auto' }}
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
                isAdmin={isAdmin} 
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
                          <MenuItem value="Instalações e infraestrutura">Instalações e infraestrutura</MenuItem>
                          <MenuItem value="Pessoal">Pessoal</MenuItem>
                          <MenuItem value="Investimento">Investimento</MenuItem>
                          <MenuItem value="Operacional e Administrativo">Operacional e Administrativo</MenuItem>
                          <MenuItem value="Outras">Outras</MenuItem>
                      </Select>
                  </FormControl>
              </Box>
              
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => handleOpenAdd(false)}
                sx={{ backgroundColor: "#F2D95C", color: "black", fontWeight: "normal", borderRadius: "50px", "&:hover": { backgroundColor: "#e0c850" }, textTransform: 'uppercase', flex: '0 0 auto' }}
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
                isAdmin={isAdmin} 
              />
            </Box>
          </Box>
        </TabPanel>
      </Box>

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