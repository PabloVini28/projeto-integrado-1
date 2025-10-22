
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