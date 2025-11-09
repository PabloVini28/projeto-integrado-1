import React, { useState, useEffect } from 'react';
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
import * as patrimonioApi from '../../services/patrimonioApiService';
import { format } from 'date-fns';


// rows will be loaded from API

const columns = [
    { id: 'nome', label: 'Nome do Item' },
    { id: 'id_patrimonio', label: 'Código' },
    { id: 'data_aquisicao', label: 'Data de Aquisição' },
    { id: 'status_patrimonio', label: 'Status' },
    { id: 'actions', label: 'Ação', align: 'center' },
];

export default function PatrimonioPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState('');
    
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

    const fetchPatrimonios = async () => {
        try {
            const res = await patrimonioApi.getPatrimonios();
            setRows(res.data);
        } catch (err) {
            console.error('Erro ao buscar patrimônio', err);
        }
    };

    useEffect(() => {
        fetchPatrimonios();
    }, []);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
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

    const confirmDelete = async () => {
        try {
            await patrimonioApi.deletePatrimonio(itemToDelete);
            await fetchPatrimonios();
        } catch (err) {
            console.error('Erro ao deletar', err);
        } finally {
            handleCloseDialogs();
        }
    };

    const handleCloseDialogs = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false); 
        setCurrentItem(null); 
        setItemToDelete(null); 
    };

    const handleSaveNewItem = async (data) => {
        try {
            await patrimonioApi.createPatrimonio(data);
            await fetchPatrimonios();
        } catch (err) {
            console.error('Erro ao criar', err);
        } finally {
            handleCloseDialogs();
        }
    };

    const handleUpdateItem = async (data) => {
        if (!currentItem || !currentItem.id_patrimonio) return;
        try {
            await patrimonioApi.updatePatrimonio(currentItem.id_patrimonio, data);
            await fetchPatrimonios();
        } catch (err) {
            console.error('Erro ao atualizar', err);
        } finally {
            handleCloseDialogs();
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Pesquisa por nome ou Código"
                    value={query}
                    onChange={handleSearchChange}
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
                        {(() => {
                            const q = query.trim().toLowerCase();
                            const filtered = q
                                ? rows.filter(r => {
                                    const nome = (r.nome || '').toString().toLowerCase();
                                    const id = (r.id_patrimonio || '').toString().toLowerCase();
                                    return nome.includes(q) || id.includes(q);
                                })
                                : rows;

                            return filtered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id_patrimonio}
                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id}>
                                                {column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                        <IconButton size="small" onClick={() => handleEdit(row)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(row.id_patrimonio)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : column.id === 'data_aquisicao' ? (
                                                    value ? format(new Date(value), 'dd/MM/yyyy') : ''
                                                ) : (
                                                    value
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ));
                        })()}
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