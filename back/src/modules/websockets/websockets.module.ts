import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
    imports: [],
    controllers: [],
    providers: [WebsocketGateway, WebsocketsService],
})
export class WebsocketsModule {}
