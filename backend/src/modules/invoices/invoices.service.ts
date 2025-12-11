import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InvoicesService {
    private readonly logger = new Logger(InvoicesService.name);

    constructor(private readonly httpService: HttpService) { }

    async emitirNotaFiscal(pedidoId: string, dadosVenda: any) {
        this.logger.log(`Iniciando emissão de NF para pedido ${pedidoId}...`);

        try {
            // Exemplo genérico de chamada para API Fiscal
            const url = process.env.NFE_API_URL;
            const apiKey = process.env.NFE_API_KEY;

            if (!url || !apiKey) {
                throw new Error('NFE_API_URL and NFE_API_KEY must be defined in environment variables');
            }

            const payload = {
                natureza_operacao: 'Venda',
                cliente: dadosVenda.cliente,
                itens: dadosVenda.itens,
                // ... mapear os dados do seu banco para o formato da API Fiscal
            };

            // Faz a requisição POST para a API externa
            const response = await lastValueFrom(
                this.httpService.post(url, payload, {
                    auth: { username: apiKey, password: '' }
                })
            );

            this.logger.log(`Nota emitida com sucesso! Protocolo: ${response.data.protocolo}`);

            // AQUI: Salvar o link do PDF e XML no seu banco de dados na tabela de Vendas/Notas
            return response.data;

        } catch (error) {
            this.logger.error(`Erro ao emitir NF: ${error.message}`, error.response?.data);
            // Importante: Implementar lógica de "fila" ou "retry" caso a API fiscal esteja fora do ar
        }
    }
}