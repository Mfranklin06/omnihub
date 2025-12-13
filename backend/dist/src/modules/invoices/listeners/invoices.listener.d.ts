import { InvoicesService } from '../invoices.service';
export declare class InvoiceListeners {
    private invoicesService;
    constructor(invoicesService: InvoicesService);
    handleOrderPaidEvent(payload: any): Promise<void>;
}
