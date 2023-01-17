import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
	imports: [UsersModule, WebsocketsModule],
	controllers: [],
	providers: [GameGateway, GameService],
	exports: [],
})
export class GameModule {}
