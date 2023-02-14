import { forwardRef, Module } from '@nestjs/common';
import { WebsocketsModule } from '../websockets/websockets.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsGateway } from './channels.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../game/game.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		WebsocketsModule,
		forwardRef(() => AuthModule),
		PrismaModule,
		GameModule,
		forwardRef(() => UsersModule),
	],
	providers: [ChatGateway, ChannelsGateway, ChatService],
	controllers: [ChatController],
	exports: [ChatService],
})
export class ChatModule {}
