import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Api42Service } from './api42.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '180s' },
		}),
		NestjsFormDataModule,
		PrismaModule,
		UsersModule,
	],
	controllers: [AuthController],
	providers: [Api42Service, AuthService],
})
export class AuthModule {}
