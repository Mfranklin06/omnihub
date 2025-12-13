"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let InvoicesService = InvoicesService_1 = class InvoicesService {
    httpService;
    logger = new common_1.Logger(InvoicesService_1.name);
    constructor(httpService) {
        this.httpService = httpService;
    }
    async emitirNotaFiscal(venda) {
        this.logger.log(`Iniciando emissão de NF para o pedido ${venda.id}...`);
        const url = process.env.NFE_API_URL;
        const token = process.env.NFE_API_TOKEN;
        if (!url || !token) {
            throw new Error('URL ou Token da API de Nota Fiscal não configurados');
        }
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
            const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, payload, {
                auth: { username: token, password: '' },
            }));
            this.logger.log(`Nota Fiscal emitida! Status: ${data.status}`);
            return data;
        }
        catch (error) {
            this.logger.error(`Erro ao emitir NF: ${error.message}`, error.response?.data);
            throw error;
        }
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map