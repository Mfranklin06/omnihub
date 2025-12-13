import { HttpService } from '@nestjs/axios';
export declare class InvoicesService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    emitirNotaFiscal(venda: any): Promise<any>;
}
