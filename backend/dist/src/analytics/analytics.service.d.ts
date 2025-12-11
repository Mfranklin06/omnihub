import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        totalRevenue: number;
        totalSales: number;
        avgTicket: number;
        totalCustomers: number;
        totalProducts: number;
        recentSales: ({
            user: {
                name: string;
            };
            customer: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                cpf: string | null;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                totalSpent: number;
                orders: number;
            } | null;
            items: ({
                product: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    sku: string;
                    price: number;
                    oldPrice: number | null;
                    stock: number;
                    category: string;
                    image: string;
                    description: string;
                    rating: number;
                    reviews: number;
                    featured: boolean;
                };
            } & {
                id: string;
                price: number;
                quantity: number;
                discount: number;
                productId: string;
                saleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            payment: import("@prisma/client").$Enums.PaymentMethod;
            status: import("@prisma/client").$Enums.SaleStatus;
            userId: string;
            customerId: string | null;
        })[];
    }>;
    getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
    getTotalSales(startDate?: Date, endDate?: Date): Promise<number>;
    getRecentSales(limit?: number): Promise<({
        user: {
            name: string;
        };
        customer: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            cpf: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            totalSpent: number;
            orders: number;
        } | null;
        items: ({
            product: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                price: number;
                oldPrice: number | null;
                stock: number;
                category: string;
                image: string;
                description: string;
                rating: number;
                reviews: number;
                featured: boolean;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            discount: number;
            productId: string;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        payment: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.SaleStatus;
        userId: string;
        customerId: string | null;
    })[]>;
    getSalesChart(days?: number): Promise<{
        name: string;
        vendas: number;
    }[]>;
    getTopProducts(limit?: number): Promise<{
        product: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: number;
            oldPrice: number | null;
            stock: number;
            category: string;
            image: string;
            description: string;
            rating: number;
            reviews: number;
            featured: boolean;
        } | null;
        totalSold: number | null;
    }[]>;
}
