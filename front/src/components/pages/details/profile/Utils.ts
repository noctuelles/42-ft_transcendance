export default function getLevelByXP(xp: number): [number, number] {
	let logProgression = Math.log2(xp / 420 + 1);

	return [Math.floor(logProgression), Math.floor((logProgression % 1) * 100)];
}
