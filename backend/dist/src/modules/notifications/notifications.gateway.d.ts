import { Server } from 'socket.io';
export declare class NotificationsGateway {
    server: Server;
    notifyNewSale(sale: any): void;
    notifyLowStock(product: any): void;
}
