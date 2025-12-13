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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceListeners = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const invoices_service_1 = require("../invoices.service");
let InvoiceListeners = class InvoiceListeners {
    invoicesService;
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    async handleOrderPaidEvent(payload) {
        console.log('Opa! Dinheiro na conta. Vamos emitir a nota para:', payload.orderId);
        await this.invoicesService.emitirNotaFiscal(payload);
    }
};
exports.InvoiceListeners = InvoiceListeners;
__decorate([
    (0, event_emitter_1.OnEvent)('order.paid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceListeners.prototype, "handleOrderPaidEvent", null);
exports.InvoiceListeners = InvoiceListeners = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoiceListeners);
//# sourceMappingURL=invoices.listener.js.map