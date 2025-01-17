import { alpha, styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
    right: 0,
    bottom: 0,
    zIndex: 9998,
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.grey[900], 0.5),
}));

export default function LoadingScreen() {
    return (
        <StyledRoot>
            <Box>
                <CircularProgress />
            </Box>
        </StyledRoot>
    );
}
