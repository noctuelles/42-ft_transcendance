import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Api42Service } from './services/api42.service';
import { UsersService } from './services/users.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { CdnModule } from './modules/cdn/cdn.module';

@Global()
@Module({
    imports: [AuthModule, PrismaModule, CdnModule, ChatModule, UsersModule],
    controllers: [],
    providers: [Api42Service, PrismaService, UsersService],
    exports: [PrismaModule],
})
export class AppModule {}
