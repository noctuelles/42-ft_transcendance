import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { Api42Service } from './services/api42.service';

@Global()
@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [Api42Service],
    exports: [Api42Service],
})
export class AppModule {}
