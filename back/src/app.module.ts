import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { CdnModule } from './modules/cdn/cdn.module';
import { ChatModule } from './modules/chat/chat.module';

@Global()
@Module({
    imports: [PrismaModule, UsersModule, AuthModule, CdnModule, ChatModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
