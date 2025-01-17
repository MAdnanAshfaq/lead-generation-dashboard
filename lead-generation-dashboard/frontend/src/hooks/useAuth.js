import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

export const useAuth = () => {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return {
        user,
        isAuthenticated,
        isManager: user?.role === 'manager',
        isEmployee: user?.role === 'employee',
        isAdmin: user?.role === 'admin'
    };
};
