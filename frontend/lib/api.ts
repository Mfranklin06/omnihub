import axios from 'axios';
import { User, Product, ProductFilters, ProductsResponse, Sale, PaginatedResponse, DashboardData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Funções auxiliares
export const apiClient = {
    // Auth
    login: (email: string, password: string) =>
        api.post<{ user: User; access_token: string }>('/auth/login', { email, password }),

    register: (name: string, email: string, password: string) =>
        api.post('/auth/register', { name, email, password }),

    getProfile: () => api.get('/auth/profile'),

    // Products
    getProducts: (params?: ProductFilters) => api.get<ProductsResponse>('/products', { params }),

    getProduct: (id: string) => api.get<Product>(`/products/${id}`),

    createProduct: (data: Partial<Product>) => api.post<Product>('/products', data),

    updateProduct: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),

    deleteProduct: (id: string) => api.delete(`/products/${id}`),

    getCategories: () => api.get('/products/categories'),

    // Sales
    getSales: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Sale>>('/sales', { params }),

    getSale: (id: string) => api.get<Sale>(`/sales/${id}`),

    createSale: (data: Partial<Sale>) => api.post<Sale>('/sales', data),

    cancelSale: (id: string) => api.put(`/sales/${id}/cancel`),

    // Customers
    getCustomers: (params?: Record<string, unknown>) => api.get('/customers', { params }),

    getCustomer: (id: string) => api.get(`/customers/${id}`),

    createCustomer: (data: Partial<User>) => api.post('/customers', data),

    updateCustomer: (id: string, data: Partial<User>) => api.put(`/customers/${id}`, data),

    // Analytics
    getDashboard: () => api.get<DashboardData>('/analytics/dashboard'),

    getRevenue: (startDate?: string, endDate?: string) =>
        api.get('/analytics/revenue', { params: { startDate, endDate } }),

    getSalesChart: (days: number = 7) =>
        api.get('/analytics/sales-chart', { params: { days } }),

    getTopProducts: (limit: number = 10) =>
        api.get('/analytics/top-products', { params: { limit } }),
};