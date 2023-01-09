import { Module } from '@nestjs/common';
import { Api42Service } from 'src/services/api42.service';
import { UsersService } from 'src/services/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [Api42Service, UsersService, AuthService],
})
export class AuthModule {}
