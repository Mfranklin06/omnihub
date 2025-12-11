import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: string, data: any) {
    // Verificar estoque
    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Produto ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para ${product.name}`);
      }
    }

    // Criar venda
    const sale = await this.prisma.sale.create({
      data: {
        userId,
        customerId: data.customerId,
        payment: data.payment,
        total: data.total,
        status: 'COMPLETED',
        items: {
          create: data.items.map((item: any) => ({
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

    // Atualizar estoque
    for (const item of data.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Atualizar estatísticas do cliente
    if (data.customerId) {
      await this.prisma.customer.update({
        where: { id: data.customerId },
        data: {
          totalSpent: { increment: data.total },
          orders: { increment: 1 },
        },
      });
    }

    // Notificar via WebSocket
    this.notificationsGateway.notifyNewSale({
      id: sale.id,
      total: sale.total,
      items: sale.items.length,
      customer: sale.customer?.name || 'Sem nome',
    });

    return sale;
  }

  async findAll(filters?: any) {
    const { startDate, endDate, status, userId, skip = 0, take = 50 } = filters || {};

    const where: any = {};

    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
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

  async findOne(id: string) {
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

  async cancel(id: string) {
    const sale = await this.findOne(id);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada');
    }

    if (sale.status === 'CANCELLED') {
      throw new BadRequestException('Venda já cancelada');
    }

    // Devolver ao estoque
    for (const item of sale.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Atualizar cliente
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
}