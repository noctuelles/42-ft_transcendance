import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { Api42Service } from './api42.service';
import { TwoFAService } from './TwoFA.service';

@Module({
	imports: [NestjsFormDataModule, PrismaModule, UsersModule],
	controllers: [AuthController],
	providers: [Api42Service, AuthService, TwoFAService],
	exports: [AuthService],
})
export class AuthModule {}
