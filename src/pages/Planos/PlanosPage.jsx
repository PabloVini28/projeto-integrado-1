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
    IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

const createData = (id, nome, codigo, valor, status) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };
  return { id, nome, codigo, valor: formatCurrency(valor), status };
};

const allRows = [
  createData(1, 'Diária', '001', 10.00, 'Ativo'),
  createData(2, 'Semanal', '002', 50.00, 'Ativo'),
  createData(3, 'Mensal', '003', 100.00, 'Ativo'),
  createData(4, 'Trimestral', '004', 250.00, 'Ativo'),
  createData(5, 'Anual', '005', 1000.00, 'Ativo'),
];

const columns = [
    { id: 'nome', label: 'Nome do Item' },
    { id: 'codigo', label: 'Código' },
    { id: 'valor', label: 'Valor' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ação', align: 'center' } 
];

export default function PlanosPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

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
        if (!searchTerm) {
            return allRows; 
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allRows.filter(row => 
            row.nome.toLowerCase().includes(lowerCaseSearchTerm) || 
            row.codigo.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [searchTerm]); 

    const handleEdit = (id) => {
        console.log(`Editar plano com ID: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Excluir plano com ID: ${id}`);
    };

    const handleNewPlan = () => {
        console.log("Abrir dialog/modal para novo plano");
    }

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
                Planos
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Pesquisa por nome ou Código"
                    variant="outlined"
                    value={searchTerm} 
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
                    onClick={handleNewPlan}
                    sx={{ 
                        backgroundColor: '#F2D95C',
                        color: 'black',
                        borderRadius: '25px',
                        '&:hover': {
                            backgroundColor: '#e0c850'
                        }
                    }}
                >
                    Novo Plano
                </Button>
            </Box>

            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Table stickyHeader aria-label="Tabela de Planos">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'} 
                                    sx={{ fontWeight: 'bold', backgroundColor: '#fff' }}
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length} 
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
            />
        </Paper>
    );
}