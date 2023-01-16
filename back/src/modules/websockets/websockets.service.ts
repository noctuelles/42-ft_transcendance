import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebsocketsService {
	private _sockets = [];
	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {}

	async registerSocket(socket) {
		socket.on('close', () => {
			this._sockets = this._sockets.filter((s) => s !== socket);
		});
		const cookies = socket['request'].headers.cookie;
		if (!cookies) {
			this.send(socket, 'error', 'No cookies found');
			socket.close();
			return;
		}
		const cookie = cookies
			.split(';')
			.find((c) => c.includes('transcendance_session_cookie'));
		if (!cookie) {
			this.send(socket, 'error', 'No session cookie found');
			socket.close();
			return;
		}
		const sessionCookie = cookie.split('=')[1];
		if (!sessionCookie) {
			this.send(socket, 'error', 'No session cookie found');
			socket.close();
			return;
		}
		try {
			const session = this.jwtService.verify(sessionCookie);
			if (!session || !session.user || !session.user.id) {
				this.send(socket, 'error', 'Invalid session cookie');
				socket.close();
				return;
			}
			const user = await this.prismaService.user.findUnique({
				where: { id: session.user.id },
			});
			if (!user) {
				this.send(socket, 'error', 'Invalid session cookie');
				socket.close();
				return;
			}
			socket['user'] = user;
			this._sockets.push(socket);
		} catch (e) {
			this.send(socket, 'error', 'Invalid session cookie');
			socket.close();
			return;
		}
	}

	send(client, event: string, data: any) {
		client.send(JSON.stringify({ event: event, data: data }));
	}

	broadcast(event: string, data: any) {
		this._sockets.forEach((socket) => {
			this.send(socket, event, data);
		});
	}
}
