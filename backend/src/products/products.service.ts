import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    const { category, search, featured, skip = 0, take = 50 } = filters || {};

    const where: any = { active: true };

    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured === 'true';
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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return product;
  }

  async create(data: any) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }

  async updateStock(id: string, quantity: number) {
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
}
