import { Module } from '@nestjs/common';
import { WebsocketsModule } from '../websockets/websockets.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({ imports: [WebsocketsModule], providers: [ChatGateway, ChatService] })
export class ChatModule {}
