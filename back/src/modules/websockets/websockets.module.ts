import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';

@Module({
	imports: [PrismaModule],
	controllers: [],
	providers: [WebsocketGateway, WebsocketsService],
	exports: [WebsocketsService],
})
export class WebsocketsModule {}
