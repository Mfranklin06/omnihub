import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  notifyNewSale(sale: any) {
    this.server.emit('newSale', {
      message: '🎉 Nova venda realizada!',
      sale,
      timestamp: new Date().toISOString(),
    });
  }

  notifyLowStock(product: any) {
    this.server.emit('lowStock', {
      message: `⚠️ Estoque baixo: ${product.name}`,
      product,
      timestamp: new Date().toISOString(),
    });
  }
}
