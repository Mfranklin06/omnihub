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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalRevenue, totalSales, totalCustomers, totalProducts, recentSales] = await Promise.all([
            this.getTotalRevenue(),
            this.getTotalSales(),
            this.prisma.customer.count(),
            this.prisma.product.count({ where: { active: true } }),
            this.getRecentSales(5),
        ]);
        return {
            totalRevenue,
            totalSales,
            avgTicket: totalSales > 0 ? totalRevenue / totalSales : 0,
            totalCustomers,
            totalProducts,
            recentSales,
        };
    }
    async getTotalRevenue(startDate, endDate) {
        const where = { status: 'COMPLETED' };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const result = await this.prisma.sale.aggregate({
            where,
            _sum: { total: true },
        });
        return result._sum.total || 0;
    }
    async getTotalSales(startDate, endDate) {
        const where = { status: 'COMPLETED' };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        return this.prisma.sale.count({ where });
    }
    async getRecentSales(limit = 10) {
        return this.prisma.sale.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                user: { select: { name: true } },
                items: { include: { product: true } },
            },
        });
    }
    async getSalesChart(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const sales = await this.prisma.sale.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startDate },
            },
            select: { createdAt: true, total: true },
        });
        const chartData = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStr = date.toLocaleDateString('pt-BR', { weekday: 'short' });
            const daySales = sales.filter((sale) => {
                const saleDate = new Date(sale.createdAt);
                return saleDate.toDateString() === date.toDateString();
            });
            const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
            chartData.push({ name: dayStr, vendas: total });
        }
        return chartData;
    }
    async getTopProducts(limit = 10) {
        const result = await this.prisma.saleItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });
        const products = await Promise.all(result.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            return {
                product,
                totalSold: item._sum.quantity,
            };
        }));
        return products;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map