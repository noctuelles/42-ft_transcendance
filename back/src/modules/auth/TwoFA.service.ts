import { BadRequestException, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
var QRCode = require('qrcode');

@Injectable()
export class TwoFAService {
	constructor(private readonly prismaService: PrismaService) {}

	private secrets = new Map();

	async enable2FA(user) {
		const secret = authenticator.generateSecret();
		this.secrets.set(user.id, secret);
		const qrCode = await this.generateQRCode(user, secret);
		return qrCode;
	}

	async generateQRCode(user, secret) {
		try {
			const otp = authenticator.keyuri(
				user.name,
				'AperTranscendance',
				secret,
			);
			return await QRCode.toDataURL(otp);
		} catch (err) {
			console.error(err);
		}
	}

	async verify2FA(user, code) {
		const secret = this.secrets.get(user.id);
		if (!secret) {
			throw new BadRequestException('Impossible to get user secret');
		}
		if (authenticator.verify({ token: code, secret })) {
			this.secrets.delete(user.id);
			await this.prismaService.user.update({
				where: { id: user.id },
				data: { otpSecret: secret },
			});
			return { result: 'activated' };
		} else {
			return { result: 'error' };
		}
	}

	async connect(user, code) {
		const secret = user.otpSecret;
		if (!secret) {
			throw new BadRequestException('2FA not enabled');
		}
		return authenticator.verify({ token: code, secret });
	}

	async disable2FA(user) {
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { otpSecret: null },
		});
	}
}
