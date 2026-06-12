import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute – wraps a page so it only renders when the user is authenticated.
 * While loading → shows a full-screen spinner.
 * If not logged in → redirects to /login.
 */
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-medium">Checking session…</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
