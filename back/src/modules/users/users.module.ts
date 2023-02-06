import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AchievementsService } from './achievments.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [PrismaModule, forwardRef(() => AuthModule)],
	controllers: [UsersController],
	providers: [UsersService, AchievementsService],
	exports: [UsersService],
})
export class UsersModule {}
