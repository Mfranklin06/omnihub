import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Para chamar a API da Nota Fiscal
import { InvoicesService } from './invoices.service';
import { InvoiceListeners } from './listeners/invoices.listener';

@Module({
    imports: [HttpModule], // O serviço de notas vai precisar fazer chamadas HTTP externas
    providers: [InvoicesService, InvoiceListeners],
})
export class InvoicesModule { }