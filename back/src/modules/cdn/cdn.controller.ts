import { Controller, Get, Param, Res } from '@nestjs/common';
const fs = require('fs');

@Controller('cdn')
export class CdnController {
	@Get('user/:userLogin')
	async user(@Param('userLogin') userLogin: string, @Res() res) {
		const imgPath = `./public/cdn/profile_pictures/${userLogin}`;
		if (fs.existsSync(imgPath)) {
			return res.sendFile(imgPath, { root: './' });
		} else {
			return res.sendFile('default-profile-picture.jpg', {
				root: 'public/cdn/profile_pictures',
			});
		}
	}

	@Get('achievements/:name')
	async achievment(@Param('name') name: string, @Res() res) {
		const imgPath = `./public/cdn/achievments/${name}`;
		if (fs.existsSync(imgPath)) {
			return res.sendFile(imgPath, { root: './' });
		} else {
			return res.sendFile('default.svg', {
				root: 'public/cdn/achievments',
			});
		}
	}
}
