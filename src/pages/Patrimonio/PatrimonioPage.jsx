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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemDialog from './PatrimonioComponents/ItemDialog';
import ConfirmaDialog from './PatrimonioComponents/ConfirmaDialog';
import * as patrimonioApi from '../../services/patrimonioApiService';
import { format, parse, isValid } from 'date-fns';


const createData = (id, nome, codigo, dataAquisicao, status) => {
    return { id, nome, codigo, dataAquisicao, status };
};

const sampleRows = [
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

const useInitialRows = () => sampleRows;

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

    const [rows, setRows] = useState(useInitialRows());

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    // notification state
    const [notification, setNotification] = useState({ open: false, severity: 'info', message: '' });
    const showNotification = (severity, message) => setNotification({ open: true, severity, message });
    const handleCloseNotification = (event, reason) => { if (reason === 'clickaway') return; setNotification(prev => ({ ...prev, open: false })); };

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
            const normalized = (res.data || []).map(r => ({
                id: r.id_patrimonio || r.id,
                id_patrimonio: r.id_patrimonio || r.id,
                nome: r.nome,
                codigo: r.id_patrimonio ? String(r.id_patrimonio) : (r.codigo || ''),
                dataAquisicao: r.data_aquisicao || r.dataAquisicao || null,
                data_aquisicao: r.data_aquisicao || r.dataAquisicao || null,
                status: r.status_patrimonio || r.status || '',
                status_patrimonio: r.status_patrimonio || r.status || '',
                _raw: r,
            }));
            setRows(normalized);
        } catch (err) {
            console.error('Erro ao buscar patrimônio', err);
        }
    };

    useEffect(() => {
        fetchPatrimonios();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleEdit = (item) => {
        setCurrentItem(item._raw || item);
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
            showNotification('success', 'Patrimônio excluído com sucesso');
        } catch (err) {
            console.error('Erro ao deletar', err);
            const msg = err?.response?.data?.error || err?.message || 'Erro ao deletar';
            showNotification('error', msg);
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
            showNotification('success', 'Patrimônio cadastrado com sucesso');
        } catch (err) {
            console.error('Erro ao criar', err);
            const msg = err?.response?.data?.error || err?.message || 'Erro ao criar';
            showNotification('error', msg);
        } finally {
            handleCloseDialogs();
        }
    };

    const handleUpdateItem = async (data) => {
        if (!currentItem || !currentItem.id_patrimonio) return;
        try {
            await patrimonioApi.updatePatrimonio(currentItem.id_patrimonio, data);
            await fetchPatrimonios();
            showNotification('success', 'Patrimônio atualizado com sucesso');
        } catch (err) {
            console.error('Erro ao atualizar', err);
            const msg = err?.response?.data?.error || err?.message || 'Erro ao atualizar';
            showNotification('error', msg);
        } finally {
            handleCloseDialogs();
        }
    };
    const filteredRows = (rows || []).filter(row =>
        (row.nome || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (row.codigo || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const formatDateValue = (value) => {
        if (!value) return '';

        if (value instanceof Date) {
            return isValid(value) ? format(value, 'dd/MM/yyyy') : '';
        }

        if (typeof value === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
            const parsed = parse(value, 'dd/MM/yyyy', new Date());
            return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '';
        }

        const d = new Date(value);
        return isValid(d) ? format(d, 'dd/MM/yyyy') : '';
    };

    const displayStatus = (s) => {
        if (!s) return '';
        const v = String(s).toLowerCase();
        if (v === 'ativo') return 'Ativo';
        if (v === 'inativo') return 'Inativo';
        if (v === 'em manutenção' || v === 'em manutencao') return 'Em manutenção';
        return v.charAt(0).toUpperCase() + v.slice(1);
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    sx={{ width: '500px' }}
                />
                <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={() => setIsAddDialogOpen(true)}
                    sx={{
                        backgroundColor: '#F2D95C',
                        color: 'black',
                        fontWeight: 'normal',
                        borderRadius: '25px',
                        '&:hover': {
                            backgroundColor: '#e0c850',
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
                        {/* <<< MUDANÇA 4: Usar 'filteredRows' ao invés de 'rows' */}
                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id_patrimonio || row.id}
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
                                                            onClick={() => handleDelete(row.id_patrimonio || row.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : column.id === 'dataAquisicao' ? (
                                                    formatDateValue(value)
                                                ) : column.id === 'status' ? (
                                                    displayStatus(value)
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
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}