
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton,
  Breadcrumbs, Link
} from '@mui/material';
import {
  PersonOutline, DescriptionOutlined, AdminPanelSettingsOutlined,
  ChevronRight, Add, Edit, Delete, NavigateNext // <-- Icone para o Breadcrumb
} from '@mui/icons-material';

const yellowButtonSx = {
  bgcolor: '#FACC15',
  color: '#1F2937',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#EAB308',
  },
};

const grayButtonSx = {
  bgcolor: '#6B7280',
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#4B5563',
  },
};

const mockUserAdmin = {
  nome: "Kelton Martins",
  matricula: "123456",
  email: "kelton@admin.com",
  role: "ADMINISTRADOR"
};

const mockUserFuncionario = {
  nome: "Julio Mateus Morais",
  matricula: "654321",
  email: "julio@funcionario.com",
  role: "FUNCIONARIO"
};

const mockFuncionarios = [
  { id: 1, nome: "Julio Mateus Morais", matricula: "123456", email: "julio@email.com" },
  { id: 2, nome: "Pablo", matricula: "147897", email: "pablo@email.com" },
  { id: 3, nome: "Guilherme pinheiro", matricula: "123783", email: "gui@email.com" },
  { id: 4, nome: "Victor", matricula: "192845", email: "victor@email.com" },
  { id: 5, nome: "Oliveira", matricula: "172839", email: "oliveira@email.com" },
];