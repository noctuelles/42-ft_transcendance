import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Api42Service } from 'src/services/api42.service';
import { UsersService } from 'src/services/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    imports: [
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '180s' },
        }),
        NestjsFormDataModule,
    ],
    controllers: [AuthController],
    providers: [Api42Service, UsersService, AuthService],
})
export class AuthModule {}
