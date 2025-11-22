import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, Button,
} from '@mui/material';
import {
    PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
    ChevronRight,
    BadgeOutlined,
    MailOutline
} from '@mui/icons-material';

import AdminArea from './ConfigComponents/AdminArea';

import AlterarSenhaDialog from './ConfigPageComponents/AlterarSenhaDialog';
import AlterarEmailDialog from './ConfigPageComponents/AlterarEmailDialog';
import CadastrarNovoUsuarioDialog from './ConfigPageComponents/CadastrarNovoUsuarioDialog';
import EditarUsuarioDialog from './ConfigPageComponents/EditarUsuarioDialog';
import ExcluirUsuarioDialog from './ConfigPageComponents/ExcluirUsuarioDialog';


const yellowButtonSx = {
    bgcolor: '#F2D95C',
    color: 'black',
    fontWeight: 'normal',
    '&:hover': {
        bgcolor: '#e0c850',
    },
    textTransform: 'none',
};

const mockUserAdmin = {
    id: 5,
    nome: "Kelton Martins Nojosa de Oliveira",
    matricula: "123456",
    cpf: "123.456.789-00",
    email: "kelton@admin.com",
    role: "ADMINISTRADOR"
};

const mockFuncionarios = [
    { id: 1, nome: "Julio Mateus Morais", cpf: "156.476.239-00", matricula: "123456", email: "eujuliomateusmorais@email.com", role: 'FUNCIONARIO' },
    { id: 2, nome: "Pablo", cpf: "987.654.321-00", matricula: "147897", email: "pablo@email.com", role: 'FUNCIONARIO' },
    { id: 3, nome: "Guilherme pinheiro", cpf: "123.783.456-00", matricula: "123783", email: "gui@email.com", role: 'FUNCIONARIO' },
    { id: 4, nome: "Victor", cpf: "192.845.678-00", matricula: "192845", email: "victor@email.com", role: 'FUNCIONARIO' },
    mockUserAdmin
];


function InfoItem({ icon, title, value }) {
    const capitalizeRole = (val) => {
        if (typeof val === 'string' && (val === 'ADMINISTRADOR' || val === 'FUNCIONARIO')) {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        }
        return val;
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {React.cloneElement(icon, { sx: { fontSize: 28, color: 'text.secondary' } })}
            <Box>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Typography variant="body1" fontWeight="Semi bold">{capitalizeRole(value)}</Typography>
            </Box>
        </Box>
    );
}

export default function ConfigPage() {

    const [user, setUser] = useState(mockUserAdmin);
    const [funcionarios, setFuncionarios] = useState(mockFuncionarios);

    const [modalOpen, setModalOpen] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenModal = (modalName, user = null) => {
        setSelectedUser(user);
        setModalOpen(modalName);
    };

    const handleCloseModal = () => {
        setModalOpen(null);
        setSelectedUser(null);
    };

    const handleAddUser = (userData) => {
        console.log("Adicionando usuário:", userData);
        const newUser = {
            ...userData,
            id: Date.now(),
            role: userData.role
        };
        setFuncionarios(prev => [...prev, newUser]);
        handleCloseModal();
    };

    const handleEditUser = (userData) => {
        console.log("Editando usuário:", userData);
        setFuncionarios(funcionarios.map(f => f.id === userData.id ? userData : f));
        handleCloseModal();
    };

    const handleDeleteUser = () => {
        console.log("Excluindo usuário:", selectedUser);
        setFuncionarios(funcionarios.filter(f => f.id !== selectedUser.id));
        handleCloseModal();
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
            <Typography variant="h4" fontWeight="bold" mb={4}>
                Configurações
            </Typography>

            <Typography variant="h5" mb={2}>Acesso</Typography>
            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2 }}
            >
                <Grid container rowSpacing={4} columnSpacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem icon={<BadgeOutlined />} title="CPF:" value={user.cpf} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem icon={<MailOutline />} title="E-mail:" value={user.email} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} />
                    </Grid>
                </Grid>
            </Paper>

            <Box mb={3} mt={5}>
                <Typography variant="h5" mb={2}>Segurança</Typography>
                <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenModal('senha')}
                            endIcon={
                                <Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ChevronRight sx={{ color: '#1F2937', fontSize: 20, }} />
                                </Box>
                            }
                            sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight: "bold", textTransform: 'none' }}
                        >
                            Alterar Senha
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenModal('email')}
                            endIcon={
                                <Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} />
                                </Box>
                            }
                            sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight: "bold", textTransform: 'none' }}
                        >
                            Alterar Email
                        </Button>
                    </Box>
                </Paper>
            </Box>

            {user.role === 'ADMINISTRADOR' && (
                <Box>
                    <AdminArea
                        funcionarios={funcionarios}
                        onAddUser={() => handleOpenModal('cadastrar')}
                        onEditUser={(user) => handleOpenModal('editar', user)}
                        onDeleteUser={(user) => handleOpenModal('excluir', user)}
                    />
                </Box>
            )}

            <AlterarSenhaDialog
                open={modalOpen === 'senha'}
                onClose={handleCloseModal}
            />
            <AlterarEmailDialog
                open={modalOpen === 'email'}
                onClose={handleCloseModal}
            />
            <CadastrarNovoUsuarioDialog
                open={modalOpen === 'cadastrar'}
                onClose={handleCloseModal}
                onSave={handleAddUser}
            />
            <EditarUsuarioDialog
                open={modalOpen === 'editar'}
                onClose={handleCloseModal}
                user={selectedUser}
                onSave={handleEditUser}
            />
            <ExcluirUsuarioDialog
                open={modalOpen === 'excluir'}
                onClose={handleCloseModal}
                user={selectedUser}
                onConfirm={handleDeleteUser}
            />
        </Paper>
    );
}