import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService], // Caso outro módulo precise usar o service de pagamentos diretamente
})
export class PaymentsModule { }