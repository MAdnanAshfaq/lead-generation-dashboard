import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { varWrapEnter } from './variants';

export default function MotionContainer({ children, ...other }) {
    return (
        <Box
            component={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={varWrapEnter}
            {...other}
        >
            {children}
        </Box>
    );
}
