import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CdnController } from './cdn.controller';

@Module({
	imports: [],
	controllers: [CdnController],
	providers: [UsersService],
})
export class CdnModule {}
