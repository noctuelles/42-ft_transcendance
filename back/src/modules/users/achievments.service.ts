import { Injectable, NotFoundException } from '@nestjs/common';
import { AchievementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { achievmentsList, IAchievement } from './achievments.interface';

@Injectable()
export class AchievementsService {
	constructor(private readonly prismaService: PrismaService) {}
	async initAchievements(userProfileId: number) {
		await this.prismaService.userAchievement.createMany({
			data: [
				...achievmentsList.map((achievement) => ({
					userProfileId,
					type: achievement.type,
					progress: achievement.defaultProgress || 0,
					bestProgress: achievement.defaultProgress || 0,
				})),
			],
		});
	}

	getAchievment(type: AchievementType): IAchievement {
		return achievmentsList.find((achievement) => achievement.type === type);
	}

	async progressAchievement(
		userProfileId: number,
		type: AchievementType,
		progress: number,
	) {
		const achievments = await this.prismaService.userAchievement.findMany({
			where: {
				userProfileId,
				type,
			},
		});
		if (achievments.length !== 1) {
			throw new NotFoundException('Achievement not found');
		}
		const achievement = achievments[0];
		let data = {
			progress: {
				increment: progress,
			},
			bestProgress: {
				set: Math.max(
					achievement.bestProgress,
					achievement.progress + progress,
				),
			},
		};
		if (
			!achievement.unlocked &&
			achievement.progress + progress >=
				this.getAchievment(type).neededProgress
		) {
			data['unlocked'] = true;
			data['unlockedAt'] = new Date();
		}
		await this.prismaService.userAchievement.update({
			where: {
				id: achievement.id,
			},
			data,
		});
	}
}
