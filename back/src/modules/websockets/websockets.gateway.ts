import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { WebsocketsService } from './websockets.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
    constructor(private readonly websocketsService: WebsocketsService) {}

    @WebSocketServer() server: Server;

    async handleConnection(socket) {
        this.websocketsService.registertSocket(socket);
    }

    @SubscribeMessage('test')
    async test(client, data) {
        console.log(client['user']);
        this.websocketsService.broadcast('test', data);
    }
}
