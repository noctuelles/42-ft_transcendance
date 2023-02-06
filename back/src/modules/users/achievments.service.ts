import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { achievmentsList } from './achievments.interface';

@Injectable()
export class AchievementsService {
	constructor(private readonly prismaService: PrismaService) {}
	async initAchievements(userProfileId: number) {
		await this.prismaService.userAchievement.createMany({
			data: [...achievmentsList.map((achievement) => ({
				userProfileId,
				type: achievement.type,
				progress: achievement.defaultProgress || 0,
				bestProgress: achievement.defaultProgress || 0,
			}))],
		});
	}
}
