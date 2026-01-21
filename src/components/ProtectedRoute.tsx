import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

import AccountDisabledModal from './dashboard/AccountDisabledModal';

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    if (user.status === 'disabled') {
        return <AccountDisabledModal open={true} />;
    }

    // Check if profile is incomplete (excluding admin and driver for now)
    if (user.profile_completed === false && !['admin', 'driver'].includes(user.role)) {
        return <Navigate to={`/signup?role=${user.role}`} replace />;
    }

    if (user.email_verified === false) {
        return <Navigate to="/verification-pending" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        const dashboardRoute = {
            shipper: '/dashboard/shipper',
            carrier: '/dashboard/carrier',
            escort: '/dashboard/escort',
            admin: '/dashboard/admin',
            driver: '/dashboard/driver'
        }[user.role] || '/';

        return <Navigate to={dashboardRoute} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
