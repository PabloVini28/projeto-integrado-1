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
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CadastroAlunoDialog from './AlunosComponents/CadastroAlunoDialog.jsx'; 
import RenovarMensalidadeDialog from './AlunosComponents/RenovarMensalidadeDialog.jsx';
// === NOVOS IMPORTS ===
import EditarAlunoDialog from './AlunosComponents/EditarAlunoDialog.jsx';
import ExcluirAlunoDialog from './AlunosComponents/ExcluirAlunoDialog.jsx';


const createStudentData = (id, nome, matricula, plano, data_matricula, data_expiracao, outrosDados = {}) => {
    return { 
        id, nome, matricula, plano, data_matricula, data_expiracao, 
        ...outrosDados 
    };
};

const studentRows = [
    createStudentData(1, 'Gabriel Pereira de Souza', '25010', 'Plano Fit', '15/07/2025', '15/08/2025', { email: 'gabriel@email.com', cpf: '111.222.333-44', telefone: '85912345678', dataNascimento: '01/01/2000', genero: 'masculino', formaPagamento: 'pix' }),
    createStudentData(2, 'Ana Clara Souza', '25102', 'Plano Premium', '20/09/2025', '20/10/2025', { email: 'ana@email.com', cpf: '222.333.444-55', telefone: '85987654321', dataNascimento: '05/03/1999', genero: 'feminino', formaPagamento: 'cartao' }),
    createStudentData(3, 'Rafael Oliveira Almeida', '23874', 'Plano Total', '11/01/2025', '11/05/2025'),
    createStudentData(4, 'Beatriz Pereira Gomes', '25820', 'Plano Fit', '05/06/2025', '05/10/2025'),
    createStudentData(5, 'Júlia Alves Ribeiro', '25649', 'Plano Fit', '01/02/2025', '01/10/2025'),
    createStudentData(6, 'Guilherme Santos Rodrigues', '24891', 'Plano Premium', '03/02/2024', '03/10/2025'),
    createStudentData(7, 'Mariana Costa Lima', '24673', 'Plano Premium', '08/01/2024', '08/10/2025'),
    createStudentData(8, 'Bruno Carvalho Azevedo', '25810', 'Plano Total', '03/10/2025', '03/11/2025'),
    createStudentData(9, 'Letícia Dias Moreira', '25730', 'Plano Start', '06/10/2025', '06/11/2025'),
    createStudentData(10, 'Matheus Cunha Barros', '25543', 'Plano Premium', '14/06/2025', '14/10/2025'),
];
const studentColumns = [
    { id: 'nome', label: 'Nome do Aluno' },
    { id: 'matricula', label: 'Matrícula' },
    { id: 'plano', label: 'Plano Ativo' },
    { id: 'data_matricula', label: 'Data de matrícula', align: 'center' }, 
    { id: 'data_expiracao', label: 'Data de Expiração', align: 'center' }, 
    { id: 'actions', label: 'Ação', align: 'center' }
];

export default function AlunosPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(''); 

    // === ESTADOS PARA OS DIALOGS ===
    const [cadastroOpen, setCadastroOpen] = useState(false);
    const [renovarOpen, setRenovarOpen] = useState(false);
    // === NOVOS ESTADOS ===
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // === HANDLERS PARA OS DIALOGS ===
    const handleAddAlunoClick = () => {
        setCadastroOpen(true);
    };

    const handleSaveNovoAluno = (novoAluno) => {
        console.log("Novo aluno para salvar na página principal:", novoAluno);
        setCadastroOpen(false);
    };

    const handleRenovarClick = () => {
        setRenovarOpen(true);
    };

    const handleRenovarMensalidade = (alunoId) => {
        console.log(`Renovar aluno com ID: ${alunoId} na página principal`);
        setRenovarOpen(false);
    };

    // === NOVOS HANDLERS (CONECTADOS AOS BOTÕES DA TABELA) ===
    const handleEdit = (id) => {
        const aluno = studentRows.find(row => row.id === id);
        console.log(`Editar Aluno:`, aluno);
        setAlunoSelecionado(aluno);
        setEditOpen(true);
    };

    const handleDelete = (id) => {
        const aluno = studentRows.find(row => row.id === id);
        console.log(`Excluir Aluno:`, aluno);
        setAlunoSelecionado(aluno);
        setDeleteOpen(true);
    };

    const handleSaveEdicao = (alunoEditado) => {
        console.log("Salvando aluno editado:", alunoEditado);
        setEditOpen(false);
        setAlunoSelecionado(null);
    };

    const handleConfirmDelete = () => {
        console.log("Excluindo aluno:", alunoSelecionado.id);
        setDeleteOpen(false);
        setAlunoSelecionado(null);
    };

    const handleCloseDialogs = () => {
        setCadastroOpen(false);
        setRenovarOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
        setTimeout(() => setAlunoSelecionado(null), 300); 
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
                height: '100%',
                backgroundColor: 'white'
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
                    sx={{ width: '500px' }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        endIcon={<AutorenewIcon />} 
                        onClick={handleRenovarClick}
                        sx={{ 
                            backgroundColor: '#F2D95C', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#e0c850' },
                            fontWeight: 'normal',
                            borderRadius: '25px' 
                        }}
                    >
                        Renovar Mensalidade
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={handleAddAlunoClick}
                        sx={{ 
                            backgroundColor: '#F2D95C', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#e0c850' },
                            fontWeight: 'normal',
                            borderRadius: '25px' 
                        }}
                    >
                        Novo Aluno
                    </Button>
                </Box>
            </Box>

            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {studentColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'} 
                                    sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}
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

                                        if (column.id === 'actions') {
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

            <CadastroAlunoDialog 
                open={cadastroOpen} 
                onClose={handleCloseDialogs} 
                onSave={handleSaveNovoAluno} 
            />

            <RenovarMensalidadeDialog 
                open={renovarOpen}
                onClose={handleCloseDialogs}
                onRenovar={handleRenovarMensalidade}
                studentList={studentRows}
            />

            <EditarAlunoDialog
                open={editOpen}
                onClose={handleCloseDialogs}
                onSave={handleSaveEdicao}
                alunoParaEditar={alunoSelecionado} 
            />

            <ExcluirAlunoDialog
                open={deleteOpen}
                onClose={handleCloseDialogs}
                onConfirm={handleConfirmDelete}
                alunoParaExcluir={alunoSelecionado}
            />
        </Paper>
    );
}