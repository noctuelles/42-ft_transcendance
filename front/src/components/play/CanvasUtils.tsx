import { IGameInfos, IGameState, IPlayer, IPosition } from './GameInterfaces';

function drawRect(
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

function drawPaddle(
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

function drawBall(
	ctx: any,
	color: string,
	ball: IPosition,
	gameInfos: IGameInfos,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, gameInfos.ballRadius, 0, 2 * Math.PI);
	ctx.fill();
}

export function drawState(state: IGameState, canvasRef: any) {
	const canvas: any = canvasRef.current;
	const ctx = canvas.getContext('2d');

	ctx.canvas.width = state.gameInfos.originalWidth;
	ctx.canvas.height = state.gameInfos.originalHeight;

	ctx.fillStyle = '#d9d9d9';
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();

	drawBall(ctx, '#000000', state.ball, state.gameInfos);

	drawPaddle(ctx, state.player1, '#ffb800', state.gameInfos);
	drawPaddle(ctx, state.player2, '#17c0e9', state.gameInfos);
}
