import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { Api42Service } from './services/api42.service';
import { UsersService } from './services/users.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Global()
@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [],
    providers: [Api42Service, PrismaService, UsersService],
    exports: [PrismaModule],
})
export class AppModule {}
