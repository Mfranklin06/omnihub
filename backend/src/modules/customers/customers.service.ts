import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.customer.create({ data });
  }

  async findAll(filters?: any) {
    const { search, skip = 0, take = 50 } = filters || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(take),
        orderBy: { totalSpent: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      customers,
      total,
      page: Math.floor(parseInt(skip) / parseInt(take)) + 1,
      pages: Math.ceil(total / parseInt(take)),
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }

    return customer;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}