import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvoicesService } from '../invoices.service';

@Injectable()
export class InvoiceListeners {
    constructor(private invoicesService: InvoicesService) { }

    @OnEvent('order.paid')
    async handleOrderPaidEvent(payload: any) {
        // Payload vem lá do Service de Pagamento
        console.log('Opa! Dinheiro na conta. Vamos emitir a nota para:', payload.orderId);

        // Chama a lógica de falar com a API de Nota Fiscal
        await this.invoicesService.emitirNotaFiscal(payload);
    }
}