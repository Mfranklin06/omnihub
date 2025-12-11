import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalRevenue, totalSales, totalCustomers, totalProducts, recentSales] =
      await Promise.all([
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

  async getTotalRevenue(startDate?: Date, endDate?: Date) {
    const where: any = { status: 'COMPLETED' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result = await this.prisma.sale.aggregate({
      where,
      _sum: { total: true },
    });

    return result._sum.total || 0;
  }

  async getTotalSales(startDate?: Date, endDate?: Date) {
    const where: any = { status: 'COMPLETED' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return this.prisma.sale.count({ where });
  }

  async getRecentSales(limit: number = 10) {
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

  async getSalesChart(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await this.prisma.sale.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: { createdAt: true, total: true },
    });

    const chartData: Array<{ name: string; vendas: number }> = [];
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

  async getTopProducts(limit: number = 10) {
    const result = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const products = await Promise.all(
      result.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          product,
          totalSold: item._sum.quantity,
        };
      }),
    );

    return products;
  }
}
