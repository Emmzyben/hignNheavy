import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'shipper' | 'carrier' | 'escort' | 'admin' | 'driver';
    profile_completed?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfileStatus: (status: boolean) => void;
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

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
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

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileStatus,
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
