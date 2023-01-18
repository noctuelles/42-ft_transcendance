import { IGameInfos, IPlayer, IPosition } from './Game';

export function drawRect(
	ctx: any,
	color: string,
	x: number,
	y: number,
	width: number,
	height: number,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	for (let i = 0; i < width; i++) {
		ctx.rect(x + i, y, 1, height);
	}
	ctx.fill();
}

export function drawPaddle(
	ctx: any,
	player: IPlayer,
	color: string,
	gameInfos: IGameInfos,
) {
	if (player.current) {
		drawRect(
			ctx,
			'#ff0000',
			player.paddle.x - 2,
			player.paddle.y - 2,
			gameInfos.paddleWidth + 4,
			gameInfos.paddleHeight + 4,
		);
	}
	drawRect(
		ctx,
		color,
		player.paddle.x,
		player.paddle.y,
		gameInfos.paddleWidth,
		gameInfos.paddleHeight,
	);
}

export function drawBall(
	ctx: any,
	color: string,
	ball: IPosition,
	gameInfos: IGameInfos,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(
		ball.x + gameInfos.ballRadius / 2,
		ball.y + gameInfos.ballRadius / 2,
		gameInfos.ballRadius,
		0,
		2 * Math.PI,
	);
	ctx.fill();
}
