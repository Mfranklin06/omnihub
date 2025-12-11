import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class SalesService {
    private prisma;
    private notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(userId: string, data: any): Promise<{
        user: {
            id: string;
            email: string;
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
    }>;
    findAll(filters?: any): Promise<{
        sales: ({
            user: {
                id: string;
                email: string;
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
        total: number;
        page: number;
        pages: number;
    }>;
    findOne(id: string): Promise<({
        user: {
            id: string;
            email: string;
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
    }) | null>;
    cancel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        payment: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.SaleStatus;
        userId: string;
        customerId: string | null;
    }>;
}
