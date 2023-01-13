import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Api42Service } from 'src/services/api42.service';
import { UsersService } from 'src/services/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    imports: [NestjsFormDataModule],
    controllers: [AuthController],
    providers: [Api42Service, UsersService, AuthService],
    exports: [],
})
export class AuthModule {}
