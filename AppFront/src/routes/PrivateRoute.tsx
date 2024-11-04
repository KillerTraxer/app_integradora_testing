import useAuthStore from '@/store/authStore';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;