import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Instale @nestjs/event-emitter
import MercadoPagoConfig, { Payment } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private client: MercadoPagoConfig;
  private paymentClient: Payment;

  constructor(private eventEmitter: EventEmitter2) {
    // Configuração Inicial do MP
    this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    this.paymentClient = new Payment(this.client);
  }

  async processWebhookPayment(paymentId: string) {
    try {
      // 1. CONSULTAR O MERCADO PAGO (Segurança)
      // Nunca confie apenas no payload do webhook, consulte a fonte real.
      const paymentData = await this.paymentClient.get({ id: paymentId });

      if (!paymentData) {
        this.logger.warn(`Pagamento ${paymentId} não encontrado no MP.`);
        return;
      }

      // 2. VERIFICAR STATUS
      if (paymentData.status === 'approved') {
        const orderId = paymentData.external_reference; // ID do seu pedido que você mandou na criação

        this.logger.log(`Pagamento Aprovado para o Pedido: ${orderId}`);

        // 3. DISPARAR EVENTO PARA O SISTEMA
        // Isso permite que o módulo de 'Sales' atualize o status
        // E o módulo de 'Invoices' emita a nota, sem acoplar código.
        this.eventEmitter.emit('order.paid', {
          orderId: orderId,
          amount: paymentData.transaction_amount,
          customerEmail: paymentData.payer.email,
          paymentDate: new Date(),
        });
      }
    } catch (error) {
      this.logger.error(`Erro ao processar webhook MP: ${error.message}`);
    }
  }
}