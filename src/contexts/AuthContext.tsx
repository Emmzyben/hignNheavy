import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'shipper' | 'carrier' | 'escort' | 'admin' | 'driver';
    status?: 'active' | 'disabled';
    profile_completed?: boolean;
    email_verified?: boolean;
    email_notifications?: boolean;
    push_notifications?: boolean;
    phone_number?: string;
    contact_number?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfileStatus: (status: boolean) => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

interface RegisterData {
    email: string;
    password: string;
    full_name: string;
    role: string;
    phone_number?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount and verify with backend
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        const validateSession = async () => {
            if (storedToken) {
                setToken(storedToken);
                // Optimistically set user from storage first
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                try {
                    // Fetch fresh profile
                    const response = await api.get('/users/me');
                    if (response.data.success) {
                        const freshUser = response.data.data;
                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    }
                } catch (error) {
                    // If token is invalid/expired, logout
                    console.error("Session validation failed", error);
                    // logout(); // Optional: decide if we want to logout on network error or just keep stale
                }
            }
            setLoading(false);
        };

        validateSession();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data.data;

                setToken(newToken);
                setUser(newUser);

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            throw new Error(message);
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data.data;

                setToken(newToken);
                setUser(newUser);

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            throw new Error(message);
        }
    };

    const updateProfileStatus = (status: boolean) => {
        if (user) {
            const updatedUser = { ...user, profile_completed: status };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const refreshUser = async () => {
        if (token) {
            try {
                const response = await api.get('/users/me');
                if (response.data.success) {
                    const freshUser = response.data.data;
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (error) {
                console.error("Failed to refresh user", error);
            }
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileStatus,
        refreshUser,
        isAuthenticated: !!user && !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
