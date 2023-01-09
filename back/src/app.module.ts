import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { Api42Service } from './services/api42.service';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [Api42Service],
})
export class AppModule {}
