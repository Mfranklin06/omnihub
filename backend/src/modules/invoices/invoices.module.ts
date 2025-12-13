import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvoicesService } from './invoices.service';
import { InvoiceListeners } from './listeners/invoices.listener';

@Module({
    imports: [HttpModule], // Importante: Libera o uso de chamadas HTTP externas
    providers: [InvoicesService, InvoiceListeners],
    exports: [InvoicesService],
})
export class InvoicesModule { }