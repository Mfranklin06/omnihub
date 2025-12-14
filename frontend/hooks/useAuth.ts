'use client';

import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export function useAuth() {
    // const router = useRouter(); // unused
    const { user, token, setUser, setToken, logout } = useStore();

    useEffect(() => {
        // Carregar do localStorage ao iniciar
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }
    }, [setToken, setUser]);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await apiClient.login(email, password);

            setToken(data.access_token);
            setUser(data.user);

            toast.success('Login realizado com sucesso!');
            return { success: true };
        } catch (error: unknown) {
            let message = 'Erro ao fazer login';
            if (error instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message = (error.response?.data as any)?.message || message;
            }
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await apiClient.register(name, email, password);
            toast.success('Conta criada com sucesso! Faça login.');
            return { success: true };
        } catch (error: unknown) {
            let message = 'Erro ao registrar';
            if (error instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message = (error.response?.data as any)?.message || message;
            }
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const handleLogout = () => {
        toast.success('Logout realizado!');
        logout();
    };

    return {
        user,
        token,
        login,
        register,
        logout: handleLogout,
        isAuthenticated: !!token,
    };
}