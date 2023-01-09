import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './services/prisma.service';
import { Api42Service } from './services/api42.service';

@Global()
@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [Api42Service, PrismaService],
    exports: [Api42Service, PrismaService],
})
export class AppModule {}
