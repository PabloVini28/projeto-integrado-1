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
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

const StatusBadge = ({ status }) => {
    const isAtivo = status === 'Ativo';
    const color = isAtivo ? 'success.main' : 'error.main';

    return (
        <Box 
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: isAtivo ? 'rgba(0, 150, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                color: isAtivo ? 'success.dark' : 'error.dark',
                borderRadius: '16px',
                px: 1,
                py: 0.5,
                fontWeight: 'medium',
                fontSize: '0.75rem',
            }}
        >
            <Box
                component="span"
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    mr: 0.5,
                }}
            />
            {status}
        </Box>
    );
};

const createStudentData = (id, nome, matricula, plano, data_inico, status) => {
    return { id, nome, matricula, plano, data_inico, status};
};

const studentRows = [
    createStudentData(1, 'Ricardo Santos', '3119', 'Plano 1', '15/10/2025', 'Ativo'),
    createStudentData(2, 'Ana Beatriz', '3120', 'Plano 2', '20/11/2025', 'Inativo'),
    createStudentData(3, 'Carlos Eduardo', '3121', 'Plano 1', '05/09/2025', 'Ativo'),
    createStudentData(4, 'Mariana Silva', '3122', 'Plano 3', '12/12/2025', 'Ativo'),
    createStudentData(5, 'João Pedro', '3123', 'Plano 2', '22/08/2025', 'Inativo'),
    createStudentData(6, 'Larissa Costa', '3124', 'Plano 1', '30/07/2025', 'Ativo'),
    createStudentData(7, 'Felipe Oliveira', '3125', 'Plano 3', '18/06/2025', 'Ativo'),
    createStudentData(8, 'Juliana Pereira', '3126', 'Plano 2', '25/05/2025', 'Inativo'),
    createStudentData(9, 'Bruno Almeida', '3127', 'Plano 1', '10/04/2025', 'Ativo'),
    createStudentData(10, 'Camila Rodrigues', '3128', 'Plano 3', '05/03/2025', 'Ativo'),
    createStudentData(11, 'Gustavo Fernandes', '3129', 'Plano 2', '15/02/2025', 'Inativo'),
    createStudentData(12, 'Isabela Martins', '3130', 'Plano 1', '20/01/2025', 'Ativo'),
    createStudentData(13, 'Lucas Lima', '3131', 'Plano 3', '30/12/2024', 'Ativo'),
    createStudentData(14, 'Sofia Gomes', '3132', 'Plano 2', '12/11/2024', 'Inativo'),
    createStudentData(15, 'Rafael Barros', '3133', 'Plano 1', '18/10/2024', 'Ativo'),
];

const studentColumns = [
    { id: 'nome', label: 'Nome do Aluno' },
    { id: 'matricula', label: 'Matrícula' },
    { id: 'plano', label: 'Plano' },
    { id: 'data_inico', label: 'Data de Início', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'actions', label: 'Ação', align: 'center' }
];

export default function AlunosPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(''); 

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (id) => {
        console.log(`Editar Aluno ID: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Excluir Aluno ID: ${id}`);
    };
    
    const handleAddAluno = () => {
        console.log("Abrir modal/página de Cadastro de Novo Aluno");
    };

    const filteredRows = studentRows.filter(row =>
        row.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.matricula.includes(searchTerm)
    );

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
                Gerenciamento de Alunos
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Pesquisar por nome ou matrícula do aluno"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onClick={handleAddAluno}
                    sx={{ 
                        backgroundColor: '#ffc107', 
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#ffb300'
                        }
                    }}
                >
                    Novo Aluno
                </Button>
            </Box>

            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {studentColumns.map((column) => (
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
                                    {studentColumns.map((column) => {
                                        const value = row[column.id];
                                        
                                        let cellContent = value;

                                        if (column.id === 'nome') {
                                            cellContent = (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography>{value}</Typography>
                                                </Box>
                                            );
                                        } else if (column.id === 'status') {
                                            cellContent = <StatusBadge status={value} />;
                                        } else if (column.id === 'actions') {
                                            cellContent = (
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <IconButton size="small" onClick={() => handleEdit(row.id)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            );
                                        }

                                        return (
                                            <TableCell key={column.id} align={column.align || 'left'}>
                                                {cellContent}
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
                labelRowsPerPage="Alunos por página:"
            />
        </Paper>
    );
}