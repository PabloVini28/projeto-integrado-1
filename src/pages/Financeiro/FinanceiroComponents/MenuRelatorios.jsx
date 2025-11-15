import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function MenuRelatorios({ onDownloadCompleto, onDownloadReceitas, onDownloadDespesas }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (action) => {
        if (action) {
            action(); 
        }
        handleClose(); 
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                    color: 'text.secondary',
                    borderColor: 'grey.400',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    textTransform: 'uppercase'
                }}
            >
                Relatórios
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem onClick={() => handleSelect(onDownloadCompleto)}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    Relatório Completo (PDF)
                </MenuItem>
                <MenuItem onClick={() => handleSelect(onDownloadReceitas)}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    Relatório de Receitas
                </MenuItem>
                <MenuItem onClick={() => handleSelect(onDownloadDespesas)}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    Relatório de Despesas
                </MenuItem>
            </Menu>
        </>
    );
}