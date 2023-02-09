import { User } from '42.js';
import {
	BadRequestException,
	Controller,
	Get,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/guards/currentUser.decorator';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('invited')
	@UseGuards(AuthGuard)
	fetchCurrentGame(@CurrentUser() user: User) {
		const game = this.gameService.getGameWherePlayerIs(user.id);
		if (!game) {
			throw new BadRequestException('No game found');
		}
		const players = game.getPlayers();
		return {
			player1: {
				name: players[0].name,
				profile_picture: players[0].profile.picture,
			},
			player2: {
				name: players[1].name,
				profile_picture: players[1].profile.picture,
			},
		};
	}
}
