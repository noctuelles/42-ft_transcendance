import { Module } from '@nestjs/common';
import { WebsocketsModule } from '../websockets/websockets.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsGateway } from './channels.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [WebsocketsModule],
	providers: [ChatGateway, ChannelsGateway, ChatService],
})
export class ChatModule {}
