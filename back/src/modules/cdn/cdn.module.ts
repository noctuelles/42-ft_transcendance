import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CdnController } from './cdn.controller';

@Module({
	imports: [UsersModule],
	controllers: [CdnController],
	providers: [],
})
export class CdnModule {}
