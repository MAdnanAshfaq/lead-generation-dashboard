import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';

const Notification = () => {
    const theme = useTheme();

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{
                '--toastify-color-success': theme.palette.success.main,
                '--toastify-color-error': theme.palette.error.main,
                '--toastify-color-warning': theme.palette.warning.main,
                '--toastify-color-info': theme.palette.info.main,
                '--toastify-font-family': theme.typography.fontFamily,
            }}
            toastStyle={{
                borderRadius: theme?.shape?.borderRadius || 8,
                boxShadow: theme?.shadows?.[2],
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        />
    );
};

export default Notification;

// Export toast functions for use throughout the app
export const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    warning: (message) => toast.warning(message),
    info: (message) => toast.info(message),
};
