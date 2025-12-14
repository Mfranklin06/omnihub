export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    description?: string;
    image: string;
    stock: number;
    rating: number;
    reviews: number;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface SaleItem {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
    product?: Product;
}

export interface Sale {
    id: string;
    customerId?: string;
    total: number;
    payment: 'CREDIT' | 'DEBIT' | 'PIX' | 'CASH';
    items: SaleItem[];
    customer?: User;
    createdAt: string;
    updatedAt?: string;
}

export interface DashboardData {
    avgTicket: number;
    totalCustomers: number;
    totalRevenue: number;
    totalSales: number;
    recentSales: Sale[];
    dailyRevenue: { date: string; value: number }[];
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pages: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pages: number;
}
