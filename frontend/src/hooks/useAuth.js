import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:8080';

/**
 * useAuth – fetches the currently logged-in user from the Express session.
 * Returns { user, loading, logout }
 *   user    → the user object from DB (null if not logged in)
 *   loading → true while the request is in-flight
 *   logout  → async function that clears the session and navigates to /login
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/current_user`, {
            credentials: 'include', // send session cookie
        })
            .then(async (res) => {
                if (!res.ok) return null; // 401 = not logged in
                return res.json();
            })
            .then((data) => {
                setUser(data || null);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const logout = async () => {
        try {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // ignore network errors — still navigate away
        }
        setUser(null);
        window.location.href = '/login';
    };

    return { user, loading, logout };
}
