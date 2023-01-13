import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketsService {
    private sockets: any[] = [];

    idx = 1;
    registertSocket(socket) {
        this.sockets.push(socket);
        socket.on('close', () => {
            this.sockets = this.sockets.filter((s) => s !== socket);
        });
        socket.user = 'User ' + this.idx++;
    }

    send(client, event: string, data: any) {
        client.send(JSON.stringify({ event: event, data: data }));
    }

    broadcast(event: string, data: any) {
        this.sockets.forEach((socket) => {
            socket.send(JSON.stringify({ event: event, data: data }));
        });
    }
}
