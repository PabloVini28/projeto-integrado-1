import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, CssBaseline,
    Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Breadcrumbs, Link as MuiLink,
    Menu, MenuItem
} from '@mui/material';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// Ícones
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Logout from '@mui/icons-material/Logout';


import logoImage from '../assets/logo/icon.png'; 

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: theme.spacing(0, 1), ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#fff',
    color: theme.palette.text.primary,
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth, flexShrink: 0, whiteSpace: 'nowrap', boxSizing: 'border-box',
        ...(open && { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }),
        ...(!open && { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }),
    }),
);

const menuItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Alunos', icon: <PeopleIcon />, path: '/alunos' },
    { text: 'Planos', icon: <CreditCardIcon />, path: '/planos' },
    { text: 'Financeiro', icon: <MonetizationOnIcon />, path: '/financeiro' },
    { text: 'Patrimônio', icon: <BusinessCenterIcon />, path: '/patrimonio' },
    { text: 'Relatórios', icon: <AssessmentIcon />, path: '/relatorios' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
];

const breadcrumbNameMap = {
    '/alunos': 'Alunos',
    '/planos': 'Planos',
    '/financeiro': 'Financeiro',
    '/patrimonio': 'Patrimônio',
    '/relatorios': 'Relatórios',
    '/configuracoes': 'Configurações',
};


export default function MainLayout() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        navigate('/login');
    };


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} elevation={1}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ marginRight: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box
                        component="img"
                        src={logoImage}
                        alt="Logo da Empresa"
                        sx={{ height: 40, marginLeft: 1 }}
                    />
                    
                    <Box sx={{ ml: 2 }}>
                        <Breadcrumbs 
                            separator={<NavigateNextIcon fontSize="small" />} 
                            aria-label="breadcrumb"
                        >
                            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                                Corpo em Forma Gestão
                            </MuiLink>
                            {pathnames.map((value, index) => {
                                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                                const isLast = index === pathnames.length - 1;
                                return isLast ? (
                                    <Typography color="text.primary" key={to}>
                                        {breadcrumbNameMap[to]}
                                    </Typography>
                                ) : (
                                    <MuiLink component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
                                        {breadcrumbNameMap[to]}
                                    </MuiLink>
                                );
                            })}
                        </Breadcrumbs>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                    
                    <IconButton
                        size="large"
                        edge="end"
                        onClick={handleProfileMenuOpen} 
                        color="inherit"
                    >
                        <AccountCircle sx={{ fontSize: '2rem' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }} 
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={RouterLink}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    borderRadius: 7,
                                    mx: 1,
                                    width: 'auto',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box 
                component="main" 
                sx={{ flexGrow: 1, p: 3, backgroundColor: '#e7919bff' }}
            >
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}