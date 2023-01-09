import { Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Api42Service } from 'src/services/api42.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [Api42Service, PrismaService],
})
export class AuthModule {}
