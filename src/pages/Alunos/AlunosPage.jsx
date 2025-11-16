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
    Collapse,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
    ListItemIcon,
    Divider 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import CadastroAlunoDialog from './AlunosComponents/CadastroAlunoDialog.jsx'; 
import EditarAlunoDialog from './AlunosComponents/EditarAlunoDialog.jsx';
import ExcluirAlunoDialog from './AlunosComponents/ExcluirAlunoDialog.jsx';

const createStudentData = (id, nome, matricula, plano, data_matricula, data_expiracao, status, outrosDados = {}) => {
    return { 
        id, nome, matricula, plano, data_matricula, data_expiracao, status,
        ...outrosDados 
    };
};

const studentRows = [
    createStudentData(1, 'Gabriel Pereira de Souza', '25010', 'Plano Fit', '15/07/2025', '15/08/2025', 'Ativo', { email: 'gabriel@email.com', cpf: '111.222.333-44', telefone: '85912345678', dataNascimento: '01/01/2000', genero: 'Masculino', endereco: { logradouro: 'Rua das Flores', numero: '123' } }),
    createStudentData(2, 'Ana Clara Souza', '25102', 'Plano Premium', '20/09/2025', '20/10/2025', 'Ativo', { email: 'ana@email.com', cpf: '222.333.444-55', telefone: '85987654321', dataNascimento: '05/03/1999', genero: 'Feminino', endereco: { logradouro: 'Av. Beira Mar', numero: '1000' } }),
    createStudentData(3, 'Rafael Oliveira Almeida', '23874', 'Plano Total', '11/01/2025', '11/05/2025', 'Inativo'),
    createStudentData(4, 'Beatriz Pereira Gomes', '25820', 'Plano Fit', '05/06/2025', '05/10/2025', 'Ativo'),
    createStudentData(5, 'Júlia Alves Ribeiro', '25649', 'Plano Fit', '01/02/2025', '01/10/2025', 'Inativo'),
    createStudentData(6, 'Guilherme Santos Rodrigues', '24891', 'Plano Premium', '03/02/2024', '03/10/2025', 'Ativo'),
    createStudentData(7, 'Mariana Costa Lima', '24673', 'Plano Premium', '08/01/2024', '08/10/2025', 'Ativo'),
    createStudentData(8, 'Bruno Carvalho Azevedo', '25810', 'Plano Total', '03/10/2025', '03/11/2025', 'Ativo'),
    createStudentData(9, 'Letícia Dias Moreira', '25730', 'Plano Start', '06/10/2025', '06/11/2025', 'Inativo'),
    createStudentData(10, 'Matheus Cunha Barros', '25543', 'Plano Premium', '14/06/2025', '14/10/2025', 'Ativo'),
];

const studentColumns = [
    { id: 'expand', label: '', width: '10px' }, 
    { id: 'nome', label: 'Nome do Aluno' },
    { id: 'matricula', label: 'Matrícula' },
    { id: 'plano', label: 'Plano' },
    { id: 'status', label: 'Status', align: 'left' }, 
    { id: 'data_expiracao', label: 'Data de Expiração', align: 'center' }, 
    { id: 'actions', label: 'Ação', align: 'center' }
];

const DetailItem = ({ title, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase' }}>
            {title}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
            {value || 'Não informado'}
        </Typography>
    </Grid>
);

function RowDetails({ row }) {
    const address = row.endereco ? `${row.endereco.logradouro}, ${row.endereco.numero}` : 'Não informado';

    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, m: 1, border: '1px solid #eee' }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
                Detalhes do Aluno
            </Typography>
            <Grid container spacing={2}>
                <DetailItem title="CPF" value={row.cpf} />
                <DetailItem title="Gênero" value={row.genero} />
                <DetailItem title="Data de Nasc." value={row.dataNascimento} />
                
                <DetailItem title="Email" value={row.email} />
                <DetailItem title="Telefone" value={row.telefone} />
                <Grid item xs={12} sm={6} md={4}> 
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase' }}>
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


export default function AlunosPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(''); 

    const [cadastroOpen, setCadastroOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [openRowId, setOpenRowId] = useState(null);

    const [statusFilter, setStatusFilter] = useState('Todos');
    const [anchorElReport, setAnchorElReport] = useState(null);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleAddAlunoClick = () => setCadastroOpen(true);
    const handleSaveNovoAluno = (novoAluno) => { console.log("Salvando...", novoAluno); setCadastroOpen(false); };
    const handleEdit = (id) => {
        const aluno = studentRows.find(row => row.id === id);
        setAlunoSelecionado(aluno);
        setEditOpen(true);
    };
    const handleDelete = (id) => {
        const aluno = studentRows.find(row => row.id === id);
        setAlunoSelecionado(aluno);
        setDeleteOpen(true);
    };
    const handleSaveEdicao = (alunoEditado) => { console.log("Editando...", alunoEditado); setEditOpen(false); setAlunoSelecionado(null); };
    const handleConfirmDelete = () => { console.log("Excluindo...", alunoSelecionado.id); setDeleteOpen(false); setAlunoSelecionado(null); };
    const handleCloseDialogs = () => {
        setCadastroOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
        setTimeout(() => setAlunoSelecionado(null), 300); 
    };

    
    const filteredRows = useMemo(() => {
        let tempRows = studentRows;
        if (statusFilter !== 'Todos') {
            tempRows = tempRows.filter(row => row.status === statusFilter);
        }
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            tempRows = tempRows.filter(row =>
                row.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
                row.matricula.includes(searchTerm)
            );
        }
        return tempRows;
    }, [searchTerm, statusFilter, studentRows]);

    
    const handleReportMenuClick = (event) => setAnchorElReport(event.currentTarget);
    const handleReportMenuClose = () => setAnchorElReport(null);

    /**
     * Lógica do download 
     * @param {'todos' | 'ativos' | 'inativos' | 'todos-detalhado' | 'ativos-detalhado' | 'inativos-detalhado'} reportType
     */
    const handleDownloadReport = async (reportType) => {
        handleReportMenuClose(); 
        
        let dataToExport = [];
        let reportTitle = "Relatório de Alunos";
        let apiCallFunction;
        let isDetailed = reportType.includes('detalhado');
        let filterType = reportType.split('-')[0]; 

        switch (filterType) {
            case 'ativos':
                dataToExport = studentRows.filter(row => row.status === 'Ativo');
                reportTitle = isDetailed ? "Relatório Detalhado (Ativos)" : "Relatório de Alunos Ativos";
                break;
            case 'inativos':
                dataToExport = studentRows.filter(row => row.status === 'Inativo');
                reportTitle = isDetailed ? "Relatório Detalhado (Inativos)" : "Relatório de Alunos Inativos";
                break;
            case 'todos':
            default:
                dataToExport = studentRows;
                reportTitle = isDetailed ? "Relatório Detalhado (Todos)" : "Relatório de Todos os Alunos";
                break;
        }

        console.log(`Iniciando geração de: ${reportTitle}`);

        if (isDetailed) {
            apiCallFunction = () => window.electronAPI.generateDetailedStudentReport(dataToExport);
        } else {
            const reportOptions = {
                title: reportTitle,
                defaultFileName: `relatorio_alunos_${filterType}.pdf`,
                headers: ['Nome', 'Matrícula', 'Plano', 'Status', 'Expiração'],
                columnWidths: [240, 100, 120, 100, 100], 
                data: dataToExport.map(row => [
                    row.nome, 
                    row.matricula, 
                    row.plano, 
                    row.status, 
                    row.data_expiracao
                ])
            };
            apiCallFunction = () => window.electronAPI.generateReport(reportOptions);
        }

        try {
            const result = await apiCallFunction();
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
                height: '100%',
                backgroundColor: 'white' 
            }}>
            
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gerenciamento de Alunos
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Pesquisar por nome ou matrícula"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: ( <InputAdornment position="start"><SearchIcon /></InputAdornment> ),
                        }}
                        sx={{ width: '400px' }}
                    />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
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
                                {studentColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'} 
                                        sx={{ fontWeight: 'bold', backgroundColor: '#fff', width: column.width }}
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
                                            <TableRow hover role="checkbox" tabIndex={-1}
                                                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                                            >
                                                {studentColumns.map((column) => {
                                                    const value = row[column.id];
                                                    
                                                    if (column.id === 'expand') {
                                                        return (
                                                            <TableCell padding="checkbox" sx={{ width: column.width }}>
                                                                <IconButton
                                                                    aria-label="expand row"
                                                                    size="small"
                                                                    onClick={() => setOpenRowId(isRowOpen ? null : row.id)}
                                                                >
                                                                    {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                </IconButton>
                                                            </TableCell>
                                                        );
                                                    }
                                                    
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
                                            
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} 
                />
            
            </Paper>

            <CadastroAlunoDialog 
                open={cadastroOpen} 
                onClose={handleCloseDialogs} 
                onSave={handleSaveNovoAluno} 
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
                <MenuItem onClick={() => handleDownloadReport('todos')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Todos os Alunos
                </MenuItem>
                <MenuItem onClick={() => handleDownloadReport('ativos')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Alunos Ativos
                </MenuItem>
                <MenuItem onClick={() => handleDownloadReport('inativos')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Alunos Inativos
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleDownloadReport('todos-detalhado')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Todos os Alunos (Detalhado)
                </MenuItem>
                <MenuItem onClick={() => handleDownloadReport('ativos-detalhado')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Alunos Ativos (Detalhado)
                </MenuItem>
                <MenuItem onClick={() => handleDownloadReport('inativos-detalhado')}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    Alunos Inativos (Detalhado)
                </MenuItem>
            </Menu>
        </Paper>
    );
}