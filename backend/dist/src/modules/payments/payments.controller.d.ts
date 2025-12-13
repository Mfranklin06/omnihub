import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    handleMercadoPagoWebhook(id: string, topic: string, body: any): Promise<{
        received: boolean;
    }>;
}
