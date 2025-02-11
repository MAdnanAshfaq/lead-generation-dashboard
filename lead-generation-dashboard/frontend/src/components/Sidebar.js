// Sidebar.js
import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const drawerWidth = 240;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1a1a1a',
                    color: '#00ff00',
                    borderRight: '1px solid #00ff00'
                },
            }}
        >
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <List>
                    <ListItem button onClick={() => navigate('/dashboard')}>
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: '#00ff00' }} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/employees')}>
                        <ListItemIcon>
                            <PeopleIcon sx={{ color: '#00ff00' }} />
                        </ListItemIcon>
                        <ListItemText primary="Employees" />
                    </ListItem>
                </List>
                <Divider sx={{ backgroundColor: '#00ff00', opacity: 0.3 }} />
                <List>
                    <ListItem button onClick={() => navigate('/settings')}>
                        <ListItemIcon>
                            <SettingsIcon sx={{ color: '#00ff00' }} />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
                
                {/* Push logout to bottom */}
                <Box sx={{ flexGrow: 1 }} />
                
                <List>
                    <Divider sx={{ backgroundColor: '#00ff00', opacity: 0.3 }} />
                    <ListItem 
                        button 
                        onClick={handleLogout}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            },
                            marginBottom: 2
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon sx={{ 
                                color: '#00ff00',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout" 
                            sx={{
                                '& .MuiTypography-root': {
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;