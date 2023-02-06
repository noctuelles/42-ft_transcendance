import {
	OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { WebsocketsService } from './websockets.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
	constructor(private readonly websocketsService: WebsocketsService) {}

	@WebSocketServer() server: Server;

	async afterInit(server: Server) {
		server.on('connection', (socket, request) => {
			socket['request'] = request;
		});
	}

	async handleConnection(socket) {
		setTimeout(async () => {
			await this.websocketsService.registerSocket(socket);
		}, 200);
	}

	async handleDisconnect(socket) {
		this.websocketsService.unregisterSocket(socket);
	}
}
