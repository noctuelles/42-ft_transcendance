import { Module } from '@nestjs/common';
import { WebsocketsModule } from '../websockets/websockets.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsGateway } from './channels.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../game/game.module';

@Module({
	imports: [WebsocketsModule, AuthModule, PrismaModule, GameModule],
	providers: [ChatGateway, ChannelsGateway, ChatService],
	controllers: [ChatController],
})
export class ChatModule {}
