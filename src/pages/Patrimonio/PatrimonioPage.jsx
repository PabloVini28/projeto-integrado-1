import React, { useState } from 'react';
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
    IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import ItemDialog from './PatrimonioComponents/ItemDialog';
import ConfirmaDialog from './PatrimonioComponents/ConfirmaDialog';


const createData = (id, nome, codigo, dataAquisicao, status) => {
  return { id, nome, codigo, dataAquisicao, status };
};

const rows = [
  createData(1, 'Leg Press', 'CF - 001', '25/07/2020', 'Ativo'),
  createData(2, 'Esteira Ergométrica', 'CF - 002', '13/06/2021', 'Ativo'),
  createData(3, 'Bicicleta Ergométrica', 'CF - 003', '20/06/2022', 'Ativo'),
  createData(4, 'Máquina de supino', 'CF - 004', '20/06/2023', 'Ativo'),
  createData(5, 'Cross-over', 'CF - 005', '20/06/2024', 'Ativo'),
  createData(6, 'Peck Deck', 'CF - 006', '24/08/2025', 'Ativo'),
  createData(7, 'Máquina Smith', 'CF - 007', '10/03/2021', 'Ativo'),
  createData(8, 'Cadeira Extensora', 'CF - 008', '10/03/2022', 'Ativo'),
  createData(9, 'Máquina de Remo', 'CF - 009', '18/03/2023', 'Ativo'),
  createData(10, 'Computador', 'CF - 010', '25/05/2024', 'Ativo'),
  createData(11, 'Bebedouro', 'CF - 011', '10/01/2025', 'Manutenção'),
  createData(12, 'Anilhas', 'CF - 012', '15/02/2021', 'Ativo'),
  createData(13, 'Halteres', 'CF - 013', '15/02/2022', 'Ativo'),
];

const columns = [
    { id: 'nome', label: 'Nome do Item' },
    { id: 'codigo', label: 'Código' },
    { id: 'dataAquisicao', label: 'Data de Aquisição' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ação', align: 'center' } 
];

export default function PatrimonioPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Pesquisa por nome ou Código"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '300px' }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddDialogOpen(true)}
                    sx={{ 
                        backgroundColor: '#F2D95C',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#e0c850' 
                        }
                    }}
                >
                    Novo Item
                </Button>
            </Box>

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
                        {rows
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
                                            <TableCell key={column.id}>
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
            />
            
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
        </Paper>
    );
}