import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('revenue')
  getRevenue(@Query('startDate') start?: string, @Query('endDate') end?: string) {
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;
    return this.analyticsService.getTotalRevenue(startDate, endDate);
  }

  @Get('sales-chart')
  getSalesChart(@Query('days') days: string = '7') {
    return this.analyticsService.getSalesChart(parseInt(days));
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit: string = '10') {
    return this.analyticsService.getTopProducts(parseInt(limit));
  }
}