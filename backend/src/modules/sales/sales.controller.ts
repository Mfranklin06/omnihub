import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  create(@Request() req, @Body() data: any) {
    return this.salesService.create(req.user.userId, data);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.salesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.salesService.cancel(id);
  }
}