import { Injectable, NotFoundException } from '@nestjs/common';
import { AchievementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsService } from '../websockets/websockets.service';
import { achievmentsList, IAchievement } from './achievments.interface';

@Injectable()
export class AchievementsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly websocketsService: WebsocketsService,
	) {}
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
			this.sendAcheivement(userProfileId, this.getAchievment(type));
			await this.prismaService.userProfile.update({
				where: {
					id: userProfileId,
				},
				data: {
					xp: {
						increment: this.getAchievment(type).xpEarned,
					},
				},
			});
		}
		await this.prismaService.userAchievement.update({
			where: {
				id: achievement.id,
			},
			data,
		});
	}

	async progressAchievements(
		userProfileId: number,
		type: AchievementType[],
		progress: number,
	) {
		type.forEach((type) => {
			this.progressAchievement(userProfileId, type, progress);
		});
	}

	async setAchievement(
		userProfileId: number,
		type: AchievementType,
		value: number,
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
		if (value > achievement.progress) {
			let data = {
				progress: {
					set: value,
				},
				bestProgress: {
					set: Math.max(achievement.bestProgress, value),
				},
			};
			if (
				!achievement.unlocked &&
				value >= this.getAchievment(type).neededProgress
			) {
				data['unlocked'] = true;
				data['unlockedAt'] = new Date();
				this.sendAcheivement(userProfileId, this.getAchievment(type));
				await this.prismaService.userProfile.update({
					where: {
						id: userProfileId,
					},
					data: {
						xp: {
							increment: this.getAchievment(type).xpEarned,
						},
					},
				});
			}
			await this.prismaService.userAchievement.update({
				where: {
					id: achievement.id,
				},
				data,
			});
		}
	}

	async setAchievements(
		userProfileId: number,
		type: AchievementType[],
		value: number,
	) {
		type.forEach((type) => {
			this.setAchievement(userProfileId, type, value);
		});
	}

	sendAcheivement(userId: number, achievement: IAchievement) {
		const sockets = this.websocketsService.getSocketsFromUsersId([userId]);
		if (sockets.length == 1) {
			const socket = sockets[0];
			this.websocketsService.send(socket, 'achievement', {
				name: achievement.name,
				xp: achievement.xpEarned,
			});
		}
	}
}
