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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const { category, search, featured, skip = 0, take = 50 } = filters || {};
        const where = { active: true };
        if (category)
            where.category = category;
        if (featured !== undefined)
            where.featured = featured === 'true';
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: parseInt(skip),
                take: parseInt(take),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            total,
            page: Math.floor(parseInt(skip) / parseInt(take)) + 1,
            pages: Math.ceil(total / parseInt(take)),
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Produto ${id} não encontrado`);
        }
        return product;
    }
    async create(data) {
        return this.prisma.product.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { active: false },
        });
    }
    async updateStock(id, quantity) {
        return this.prisma.product.update({
            where: { id },
            data: { stock: { increment: quantity } },
        });
    }
    async getCategories() {
        const products = await this.prisma.product.findMany({
            where: { active: true },
            select: { category: true },
            distinct: ['category'],
        });
        return products.map((p) => p.category);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map