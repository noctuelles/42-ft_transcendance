import { Controller, Get, Param, Res } from '@nestjs/common';
const fs = require('fs');

@Controller('cdn')
export class CdnController {
	@Get('user/:userLogin')
	async user(@Param('userLogin') userLogin: string, @Res() res) {
		const imgPath = `./cdn/profile_pictures/${userLogin}`;
		if (fs.existsSync(imgPath)) {
			return res.sendFile(imgPath, { root: 'public' });
		} else {
			return res.sendFile('default.jpg', {
				root: 'public/cdn/profile_pictures',
			});
		}
	}
}
