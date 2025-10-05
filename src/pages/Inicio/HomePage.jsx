import React from 'react';
import { Typography, Box } from '@mui/material';

export default function HomePage() {
    return (
        <Box >
            <Typography variant="h4" gutterBottom>
                Receba o Layout!
            </Typography>
            <Typography variant="h6" gutterBottom>
                Coloquei esse fundo rosa apenas pra marcar o espaço ocupado, não vai ser rosa :)
            </Typography>
        </Box>
    );
}