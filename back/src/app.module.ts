import { Global, Module } from '@nestjs/common';
import { Api42Service } from './modules/auth/api42.service';
import { UsersService } from './modules/users/users.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { CdnModule } from './modules/cdn/cdn.module';
import {ChatModule} from './chat/chat.module';

@Global()
@Module({
	imports: [AuthModule, PrismaModule, CdnModule, UsersModule, ChatModule],
	controllers: [],
	providers: [Api42Service, PrismaService, UsersService],
	exports: [PrismaModule],
})
export class AppModule {}
