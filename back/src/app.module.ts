import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Api42Service } from './services/api42.service';
import { UsersService } from './services/users.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { CdnModule } from './modules/cdn/cdn.module';

@Global()
@Module({
    imports: [AuthModule, PrismaModule, CdnModule, ChatModule],
    controllers: [],
    providers: [Api42Service, PrismaService, UsersService],
    exports: [PrismaModule],
})
export class AppModule {}
