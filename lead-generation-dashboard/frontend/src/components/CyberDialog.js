import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Fade
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const CyberDialog = ({ open, onClose, onConfirm, title, content }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid #00ff00',
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                    minWidth: '320px',
                    position: 'relative',
                    overflow: 'hidden'
                }
            }}
        >
            <Box
                className="scan-line"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
                    animation: 'scan 2s linear infinite',
                    zIndex: 1
                }}
            />
            
            <DialogTitle sx={{ 
                color: '#00ff00',
                fontFamily: 'Orbitron, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid rgba(0, 255, 0, 0.3)'
            }}>
                <WarningIcon sx={{ color: '#00ff00' }} />
                {title}
            </DialogTitle>
            
            <DialogContent sx={{ my: 2 }}>
                <Typography 
                    sx={{ 
                        color: '#00ff00',
                        fontFamily: 'Orbitron, sans-serif',
                        textAlign: 'center'
                    }}
                >
                    {content}
                </Typography>
            </DialogContent>
            
            <DialogActions sx={{ 
                borderTop: '1px solid rgba(0, 255, 0, 0.3)',
                padding: 2,
                justifyContent: 'center',
                gap: 2
            }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#00ff00',
                        borderColor: '#00ff00',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            borderColor: '#00ff00',
                        },
                        fontFamily: 'Orbitron, sans-serif',
                        minWidth: '100px'
                    }}
                    variant="outlined"
                >
                    CANCEL
                </Button>
                <Button
                    onClick={onConfirm}
                    sx={{
                        color: '#000',
                        backgroundColor: '#00ff00',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 255, 0, 0.8)',
                        },
                        fontFamily: 'Orbitron, sans-serif',
                        minWidth: '100px'
                    }}
                    variant="contained"
                >
                    CONFIRM
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CyberDialog; 