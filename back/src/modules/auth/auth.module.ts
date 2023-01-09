import { Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Api42Service } from 'src/services/api42.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [Api42Service],
})
export class AuthModule {}
