import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, BadgeOutlined, MailOutline 
} from '@mui/icons-material';

import AdminArea from './ConfigComponents/AdminArea';

import AlterarSenhaDialog from './ConfigPageComponents/AlterarSenhaDialog';
import AlterarEmailDialog from './ConfigPageComponents/AlterarEmailDialog';
import CadastrarNovoUsuarioDialog from './ConfigPageComponents/CadastrarNovoUsuarioDialog';
import EditarUsuarioDialog from './ConfigPageComponents/EditarUsuarioDialog';
import ExcluirUsuarioDialog from './ConfigPageComponents/ExcluirUsuarioDialog';

function InfoItem({ icon, title, value }) {
  const capitalizeRole = (val) => {
    if (!val || val === '---') return val;
    if (typeof val === 'string' && (val.toUpperCase() === 'ADMINISTRADOR' || val.toUpperCase() === 'FUNCIONARIO')) {
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
  const [user, setUser] = useState({
    id: '',
    nome: 'Carregando...',
    matricula: '---',
    cpf: '---',
    email: '---',
    role: ''
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
        try {
            const storedData = localStorage.getItem('userData');
            const token = localStorage.getItem('authToken');

            if (storedData) {
                const parsedUser = JSON.parse(storedData);
                const id = parsedUser.id_funcionario || parsedUser.id;

                setUser({
                    id: id,
                    nome: parsedUser.nome_funcionario || parsedUser.nome || '---',
                    matricula: id ? id.toString() : '---',
                    cpf: parsedUser.cpf_funcionario || parsedUser.cpf || '---',
                    email: parsedUser.email_funcionario || parsedUser.email || '---',
                    role: parsedUser.nivel_acesso ? parsedUser.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
                });

                if (id && token) {
                    try {
                        const response = await fetch(`http://localhost:4000/api/funcionario/id/${id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) {
                            const fullData = await response.json();
                            setUser(prev => ({
                                ...prev,
                                nome: fullData.nome_funcionario,
                                cpf: fullData.cpf_funcionario,
                                email: fullData.email_funcionario,
                                role: fullData.nivel_acesso ? fullData.nivel_acesso.toUpperCase() : prev.role
                            }));
                        }
                    } catch (err) {
                        console.error("Erro ao buscar detalhes do usuário:", err);
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao ler dados do usuário:", error);
        }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchFuncionarios = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:4000/api/funcionario', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const listaFormatada = data.map(f => ({
                    id: f.id_funcionario,
                    nome: f.nome_funcionario,
                    cpf: f.cpf_funcionario,
                    matricula: f.id_funcionario.toString(),
                    email: f.email_funcionario,
                    role: f.nivel_acesso ? f.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
                }));
                setFuncionarios(listaFormatada);
            }
        } catch (error) {
            console.error("Erro de conexão com a API:", error);
        }
    };

    if (user.role === 'ADMINISTRADOR') {
        fetchFuncionarios();
    }
  }, [user.role]); 

  const handleOpenModal = (modalName, userToEdit = null) => {
    setSelectedUser(userToEdit);
    setModalOpen(modalName);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };

  const handleAddUser = async (userData) => {
    const token = localStorage.getItem('authToken');
    const payload = {
        nome_funcionario: userData.nome,
        email_funcionario: userData.email,
        cpf_funcionario: userData.cpf,
        senha: userData.senha,
        nivel_acesso: userData.role === 'ADMINISTRADOR' ? 'Administrador' : 'Funcionário' 
    };

    try {
        const response = await fetch('http://localhost:4000/api/funcionario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const novo = await response.json();
            const novoTela = {
                id: novo.id_funcionario,
                nome: novo.nome_funcionario,
                cpf: novo.cpf_funcionario,
                matricula: novo.id_funcionario.toString(),
                email: novo.email_funcionario,
                role: novo.nivel_acesso ? novo.nivel_acesso.toUpperCase() : 'FUNCIONARIO'
            };
            setFuncionarios([...funcionarios, novoTela]);
            alert("Usuário cadastrado com sucesso!");
            handleCloseModal();
        } else {
            const err = await response.json();
            alert("Erro ao cadastrar: " + (err.error || response.statusText));
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
  };

  const handleEditUser = async (updatedData) => {
    const token = localStorage.getItem('authToken');
    
    const payload = {
        nome_funcionario: updatedData.nome,
        cpf_funcionario: updatedData.cpf,
        nivel_acesso: updatedData.role === 'ADMINISTRADOR' ? 'Administrador' : 'Funcionário',
        senha: updatedData.senha 
    };

    try {
        const response = await fetch(`http://localhost:4000/api/funcionario/${selectedUser.cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const atualizado = await response.json();
            
            const novaLista = funcionarios.map(f => {
                if (f.id === selectedUser.id) {
                    return {
                        ...f,
                        nome: atualizado.nome_funcionario,
                        cpf: atualizado.cpf_funcionario,
                        role: atualizado.nivel_acesso ? atualizado.nivel_acesso.toUpperCase() : 'FUNCIONARIO',
                    };
                }
                return f;
            });

            setFuncionarios(novaLista);
            alert("Usuário atualizado com sucesso!");
            handleCloseModal();
        } else {
            const err = await response.json();
            alert("Erro ao atualizar: " + (err.error || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
  };
  
  const handleDeleteUser = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`http://localhost:4000/api/funcionario/${selectedUser.cpf}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            setFuncionarios(funcionarios.filter(f => f.id !== selectedUser.id));
            alert("Usuário removido com sucesso!");
            handleCloseModal();
        } else {
            alert("Erro ao excluir usuário.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
  };

  return (
    <Box sx={{ p: 4 }}> 
      <Typography variant="h4" fontWeight="bold" mb={4}>Configurações</Typography>

      <Typography variant="h5"  mb={2}>Acesso</Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<PersonOutline />} title="Logado como:" value={user.nome} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<DescriptionOutlined />} title="Matrícula:" value={user.matricula} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<BadgeOutlined />} title="CPF:" value={user.cpf} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<MailOutline />} title="E-mail:" value={user.email} /></Grid>
          <Grid item xs={12} sm={6} md={4}><InfoItem icon={<AdminPanelSettingsOutlined />} title="Nível:" value={user.role} /></Grid>
        </Grid>
      </Paper>

      <Box mb={3} mt={5}> 
        <Typography variant="h5" mb={2}>Segurança</Typography> 
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, width: '100%' }}>
            <Button variant="contained" onClick={() => handleOpenModal('senha')} endIcon={<Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight sx={{ color: '#1F2937', fontSize: 20,  }} /></Box>} sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}>Alterar Senha</Button>
            <Button variant="contained" onClick={() => handleOpenModal('email')} endIcon={<Box sx={{ bgcolor: '#F2D95C', width: 36, height: 36, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight sx={{ color: '#1F2937', fontSize: 20 }} /></Box>} sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', border: '1px solid #e0e0e0', justifyContent: 'space-between', p: 2, '&:hover': { bgcolor: '#f9f9f9' }, fontWeight:"bold", textTransform: 'none' }}>Alterar Email</Button>
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

      <AlterarSenhaDialog open={modalOpen === 'senha'} onClose={handleCloseModal} />
      <AlterarEmailDialog open={modalOpen === 'email'} onClose={handleCloseModal} />
      <CadastrarNovoUsuarioDialog open={modalOpen === 'cadastrar'} onClose={handleCloseModal} onSave={handleAddUser} />
      <EditarUsuarioDialog open={modalOpen === 'editar'} onClose={handleCloseModal} user={selectedUser} onSave={handleEditUser} />
      <ExcluirUsuarioDialog open={modalOpen === 'excluir'} onClose={handleCloseModal} user={selectedUser} onConfirm={handleDeleteUser} />
    </Box>
  );
}