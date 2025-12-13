import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PaymentsService {
    private eventEmitter;
    private readonly logger;
    private client;
    private paymentClient;
    constructor(eventEmitter: EventEmitter2);
    processWebhookPayment(paymentId: string): Promise<void>;
}
