import React from 'react';
import { Box, Typography, Avatar, IconButton, Button, Divider } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function ConfigPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#212121',
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1550,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    position: 'relative',
                    mb: 3,
                }}>
                    <IconButton sx={{ position: 'absolute', left: 0 }}>
                        <SettingsIcon />
                    </IconButton>
                    <Typography variant="h6" component="h1">
                        Configurações
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', mb: 1 }}>
                    <Avatar
                        alt="Kelton Martins"
                        src="" 
                        sx={{ width: 120, height: 120 }}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: '#f0f0f0',
                            '&:hover': { bgcolor: '#e0e0e0' },
                        }}
                    >
                        <PhotoCameraIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 4 }}>
                    <Typography variant="h5">Kelton Martins</Typography>
                    <IconButton size="small">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </Box>

                <Box sx={{ width: '100%', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'left' }}>
                        Preferências:
                    </Typography>

                    <Button fullWidth sx={{ display: 'flex', justifyContent: 'space-between', p: '8px 0', textTransform: 'none', color: 'text.primary' }}>
                        <Typography variant="body1">Tema</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body1" color="text.secondary">Claro</Typography>
                            <ChevronRightIcon />
                        </Box>
                    </Button>

                     <Button fullWidth sx={{ display: 'flex', justifyContent: 'space-between', p: '8px 0', textTransform: 'none', color: 'text.primary' }}>
                        <Typography variant="body1">Notificações</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body1" color="text.secondary">Sim</Typography>
                            <ChevronRightIcon />
                        </Box>
                    </Button>
                </Box>

                <Divider sx={{ width: '100%' }} />

                <Box sx={{ width: '100%', my: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'left' }}>
                        Conta:
                    </Typography>
                    <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start', textTransform: 'none', p: '8px 0', color: 'text.primary' }}>
                       Alterar Senha
                    </Button>
                    <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start', textTransform: 'none', p: '8px 0', color: 'text.primary' }}>
                       Alterar E-mail
                    </Button>
                </Box>

                <Divider sx={{ width: '100%' }} />

                <Box sx={{ width: '100%', mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                     <Button
                        variant="text"
                        startIcon={<HelpOutlineIcon />}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        Suporte
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}