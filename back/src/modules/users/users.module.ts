import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { AchievementsService } from './achievments.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		PrismaModule,
		forwardRef(() => AuthModule),
		forwardRef(() => ChatModule),
		WebsocketsModule,
	],
	controllers: [UsersController],
	providers: [UsersService, AchievementsService],
	exports: [UsersService, AchievementsService],
})
export class UsersModule {}
