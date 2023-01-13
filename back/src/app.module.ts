import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Api42Service } from './services/api42.service';
import { UsersService } from './services/users.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { CdnModule } from './modules/cdn/cdn.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketsService } from './modules/websockets/websockets.service';

@Global()
@Module({
    imports: [
        AuthModule,
        PrismaModule,
        CdnModule,
        WebsocketsModule,
        ChatModule,
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '180s' },
        }),
    ],
    controllers: [],
    providers: [Api42Service, PrismaService, UsersService],
    exports: [PrismaModule, JwtModule, WebsocketsModule],
})
export class AppModule {}
