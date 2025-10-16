import React from 'react';
import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
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
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1550,
                    bgcolor: 'background.paper',
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
                <Box
                        sx={{
                            position: 'relative',
                            mb: 1,
                        }}
                    >
                        <Avatar
                            alt="Kelton Martins"
                            
                            src=""
                            sx={{ width: 120, height: 120 }}
                        />
                        {}
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: '#f0f0f0', 
                                '&:hover': {
                                    bgcolor: '#e0e0e0',
                                },
                            }}
                        >
                            <PhotoCameraIcon />
                        </IconButton>
                </Box>

            </Box>
            
        </Box>
    );
}