import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
	imports: [
		UsersModule,
		WebsocketsModule,
		PrismaModule,
		forwardRef(() => AuthModule),
	],
	controllers: [GameController],
	providers: [GameGateway, GameService],
	exports: [GameService],
})
export class GameModule {}
