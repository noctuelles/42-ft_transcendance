import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { CdnModule } from './modules/cdn/cdn.module';
import { ChatModule } from './modules/chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { GameModule } from './modules/game/game.module';
import { UserExistsRule } from './modules/users/users.service';

@Global()
@Module({
	imports: [
		PrismaModule,
		UsersModule,
		AuthModule,
		CdnModule,
		WebsocketsModule,
		ChatModule,
		GameModule,
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '99999s' },
		}),
	],
	controllers: [],
	providers: [UserExistsRule],
	exports: [JwtModule],
})
export class AppModule {}
