import { Controller, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // O Mercado Pago envia um POST para cá
  // Rota pública: https://sua-api.com/payments/webhook/mercadopago
  @Post('webhook/mercadopago')
  @HttpCode(HttpStatus.OK) // Sempre retorne 200 para o MP não ficar tentando reenviar
  async handleMercadoPagoWebhook(
    @Query('id') id: string, 
    @Query('topic') topic: string,
    @Body() body: any // Payload genérico caso venha info no body
  ) {
    // O MP as vezes manda o ID na query (?id=123) ou no body ({ data: { id: 123 } })
    const paymentId = id || body?.data?.id;

    // Filtramos apenas notificações de "payment"
    // (O MP avisa sobre várias coisas, focamos só no pagamento)
    if (topic === 'payment' || body?.type === 'payment') {
      await this.paymentsService.processWebhookPayment(paymentId);
    }

    return { received: true };
  }
}