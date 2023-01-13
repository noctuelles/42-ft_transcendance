import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebsocketGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
    imports: [],
    controllers: [],
    providers: [WebsocketGateway, WebsocketsService],
    exports: [WebsocketsService],
})
export class WebsocketsModule {}
