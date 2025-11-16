import React, { useState, useMemo } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
    ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ItemDialog from './PatrimonioComponents/ItemDialog';
import ConfirmaDialog from './PatrimonioComponents/ConfirmaDialog';


const createData = (id, nome, codigo, dataAquisicao, status) => {
  return { id, nome, codigo, dataAquisicao, status };
};

const allRows = [
  createData(1, 'Leg Press', '001', '25/07/2020', 'Ativo'),
  createData(2, 'Esteira Ergométrica', '002', '13/06/2021', 'Ativo'),
  createData(3, 'Bicicleta Ergométrica', '003', '20/06/2022', 'Ativo'),
  createData(4, 'Máquina de supino', '004', '20/06/2023', 'Ativo'),
  createData(5, 'Cross-over', '005', '20/06/2024', 'Ativo'),
  createData(6, 'Peck Deck', '006', '24/08/2025', 'Ativo'),
  createData(7, 'Máquina Smith', '007', '10/03/2021', 'Ativo'),
  createData(8, 'Cadeira Extensora', '008', '10/03/2022', 'Ativo'),
  createData(9, 'Máquina de Remo', '009', '18/03/2023', 'Ativo'),
  createData(10, 'Computador', '010', '25/05/2024', 'Ativo'),
  createData(11, 'Bebedouro', '011', '10/01/2025', 'Manutenção'),
  createData(12, 'Anilhas', '012', '15/02/2021', 'Ativo'),
  createData(13, 'Halteres', '013', '15/02/2022', 'Inativo'),
];

const columns = [
    { id: 'nome', label: 'Nome do Item' },
    { id: 'codigo', label: 'Código' },
    { id: 'dataAquisicao', label: 'Data de Aquisição' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ação', align: 'center' } 
];

const primaryColor = '#F2D95C';
const primaryHoverColor = '#e0c850';

export default function PatrimonioPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const [anchorElReport, setAnchorElReport] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (item) => {
        setCurrentItem(item); 
        setIsEditDialogOpen(true); 
    };

    const handleDelete = (id) => {
        setItemToDelete(id); 
        setIsDeleteDialogOpen(true); 
    };

    const confirmDelete = () => {
        console.log(`Excluindo item com ID: ${itemToDelete}`);
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
        console.log("Salvando NOVO item:", data);
        handleCloseDialogs();
    };

    const handleUpdateItem = (data) => {
        console.log("Atualizando item:", data);
        handleCloseDialogs();
    };

    const filteredRows = useMemo(() => {
        let tempRows = allRows;

        if (statusFilter !== 'Todos') {
            tempRows = tempRows.filter(row => row.status === statusFilter);
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            tempRows = tempRows.filter(row =>
                row.nome.toLowerCase().includes(lowerSearchTerm) ||
                row.codigo.toLowerCase().includes(lowerSearchTerm)
            );
        }
        return tempRows;
    }, [searchTerm, statusFilter]);

    const handleReportMenuClick = (event) => {
        setAnchorElReport(event.currentTarget);
    };

    const handleReportMenuClose = () => {
        setAnchorElReport(null);
    };

    const handleDownloadReport = async () => {
        handleReportMenuClose(); 
        console.log("Iniciando geração de relatório de Patrimônio...");
        
        const reportOptions = {
            title: 'Relatório de Patrimônio',
            defaultFileName: `relatorio_patrimonio_${new Date().toISOString().split('T')[0]}.pdf`,
            headers: ['Nome do Item', 'Código', 'Data de Aquisição', 'Status'],
            columnWidths: [300, 120, 150, 172], 
            
            data: allRows.map(row => [ 
                row.nome,
                row.codigo,
                row.dataAquisicao,
                row.status
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

    return (
        <Paper 
        elevation={0}
        sx={{ 
            width: '100%', 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%' 
        }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Patrimônio e bens
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Pesquisa por Nome ou Código"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        sx={{ 
                            width: '400px',
                        }}
                    />
                    <FormControl 
                        size="small" 
                        sx={{ 
                            minWidth: 180,
                        }}
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
                            <MenuItem value="Manutenção">Manutenção</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleReportMenuClick}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{
                            color: 'text.secondary',
                            borderColor: 'grey.400',
                            fontWeight: 'normal',
                            borderRadius: '25px',
                        }}
                    >
                        Relatórios
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={() => setIsAddDialogOpen(true)}
                        sx={{ 
                            backgroundColor: primaryColor,
                            color: 'black',
                            fontWeight: 'normal',
                            borderRadius: '25px',
                            '&:hover': {
                                backgroundColor: primaryHoverColor,
                            }
                        }}
                    >
                        Novo Item
                    </Button>
                </Box>
            </Box>

            <Paper 
                variant="outlined" 
                elevation={0} 
                sx={{ 
                    borderRadius: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexGrow: 1, 
                    overflow: 'hidden' 
                }}
            >
                <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'} 
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow 
                                        hover 
                                        role="checkbox" 
                                        tabIndex={-1} 
                                        key={row.id}
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align || 'left'}>
                                                    {column.id === 'actions' ? (
                                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEdit(row)}
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
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
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
                    labelRowsPerPage="Itens por página:"
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} 
                />
            
            </Paper>

            <ItemDialog
                open={isAddDialogOpen}
                onClose={handleCloseDialogs}
                onSave={handleSaveNewItem}
                title="Cadastre um novo Item"
            />
            
            <ItemDialog
                open={isEditDialogOpen}
                onClose={handleCloseDialogs}
                onSave={handleUpdateItem}
                title="Editar Item"
                itemToEdit={currentItem}
            />

            <ConfirmaDialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDialogs}
                onConfirm={confirmDelete}
                title="Tem certeza que deseja excluir?"
            />

            <Menu
                anchorEl={anchorElReport}
                open={Boolean(anchorElReport)}
                onClose={handleReportMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleDownloadReport}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Relatório de Patrimônio (PDF)
                </MenuItem>
            </Menu>
        </Paper>
    );
}