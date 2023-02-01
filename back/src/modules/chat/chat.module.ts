import { Module } from '@nestjs/common';
import { WebsocketsModule } from '../websockets/websockets.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsGateway } from './channels.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';

@Module({
	imports: [WebsocketsModule, AuthModule],
	providers: [ChatGateway, ChannelsGateway, ChatService],
	controllers: [ChatController],
})
export class ChatModule {}
