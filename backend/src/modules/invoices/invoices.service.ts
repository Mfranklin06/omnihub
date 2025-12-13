import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InvoicesService {
    private readonly logger = new Logger(InvoicesService.name);

    // Injetamos o HttpService para poder chamar APIs externas (REST)
    constructor(private readonly httpService: HttpService) { }

    async emitirNotaFiscal(venda: any) {
        this.logger.log(`Iniciando emissão de NF para o pedido ${venda.id}...`);

        const url = process.env.NFE_API_URL; // Ex: https://api.focusnfe.com.br/v2/
        const token = process.env.NFE_API_TOKEN;

        if (!url || !token) {
            throw new Error('URL ou Token da API de Nota Fiscal não configurados');
        }
        // Payload fictício padrão ABRASF/FocusNFe
        const payload = {
            natureza_operacao: 'Venda de Mercadoria',
            data_emissao: new Date().toISOString(),
            cliente: {
                nome: venda.clienteNome,
                cpf: venda.clienteCpf,
                email: venda.clienteEmail,
            },
            servico: {
                valor: venda.valorTotal,
                discriminacao: `Venda de produtos referente ao pedido ${venda.id}`,
            },
        };

        try {
            // O 'lastValueFrom' transforma o Observable do Axios em uma Promise (padrão moderno do Nest)
            const { data } = await lastValueFrom(
                this.httpService.post(url, payload, {
                    auth: { username: token, password: '' }, // Basic Auth comum em APIs fiscais
                }),
            );

            this.logger.log(`Nota Fiscal emitida! Status: ${data.status}`);
            return data; // Retorna o JSON da API fiscal (com link do PDF, XML, etc)

        } catch (error) {
            this.logger.error(`Erro ao emitir NF: ${error.message}`, error.response?.data);
            // Dica Pro: Aqui você salvaria no banco que a nota "Falhou" para tentar de novo depois
            throw error;
        }
    }
}