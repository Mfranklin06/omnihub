"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let SalesService = class SalesService {
    prisma;
    notificationsGateway;
    constructor(prisma, notificationsGateway) {
        this.prisma = prisma;
        this.notificationsGateway = notificationsGateway;
    }
    async create(userId, data) {
        for (const item of data.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Produto ${item.productId} não encontrado`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Estoque insuficiente para ${product.name}`);
            }
        }
        const sale = await this.prisma.sale.create({
            data: {
                userId,
                customerId: data.customerId,
                payment: data.payment,
                total: data.total,
                status: 'COMPLETED',
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        discount: item.discount || 0,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        for (const item of data.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        if (data.customerId) {
            await this.prisma.customer.update({
                where: { id: data.customerId },
                data: {
                    totalSpent: { increment: data.total },
                    orders: { increment: 1 },
                },
            });
        }
        this.notificationsGateway.notifyNewSale({
            id: sale.id,
            total: sale.total,
            items: sale.items.length,
            customer: sale.customer?.name || 'Sem nome',
        });
        return sale;
    }
    async findAll(filters) {
        const { startDate, endDate, status, userId, skip = 0, take = 50 } = filters || {};
        const where = {};
        if (status)
            where.status = status;
        if (userId)
            where.userId = userId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip: parseInt(skip),
                take: parseInt(take),
                include: {
                    items: {
                        include: { product: true },
                    },
                    customer: true,
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.sale.count({ where }),
        ]);
        return {
            sales,
            total,
            page: Math.floor(parseInt(skip) / parseInt(take)) + 1,
            pages: Math.ceil(total / parseInt(take)),
        };
    }
    async findOne(id) {
        return this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async cancel(id) {
        const sale = await this.findOne(id);
        if (!sale) {
            throw new common_1.BadRequestException('Venda não encontrada');
        }
        if (sale.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Venda já cancelada');
        }
        for (const item of sale.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
            });
        }
        if (sale.customerId) {
            await this.prisma.customer.update({
                where: { id: sale.customerId },
                data: {
                    totalSpent: { decrement: sale.total },
                    orders: { decrement: 1 },
                },
            });
        }
        return this.prisma.sale.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], SalesService);
//# sourceMappingURL=sales.service.js.map