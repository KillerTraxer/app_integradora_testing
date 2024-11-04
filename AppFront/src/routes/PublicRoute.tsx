import useAuthStore from '@/store/authStore';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuthStore();

    if (isLoggedIn) {
        return <Navigate to='/home' replace />;
    }

    return <>{children}</>;
}

export default PublicRoute;