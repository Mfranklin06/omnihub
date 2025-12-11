import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
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
    getRevenue(start?: string, end?: string): Promise<number>;
    getSalesChart(days?: string): Promise<{
        name: string;
        vendas: number;
    }[]>;
    getTopProducts(limit?: string): Promise<{
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
