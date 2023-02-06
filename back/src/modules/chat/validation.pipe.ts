import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateChannelDTO } from './JoinChannel.dto';

@Injectable()
export class CreateChannelValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		let groups = [];

		if (value.channelType === 'Password Protected') groups.push('password');

		const channel = plainToInstance(CreateChannelDTO, value, {
			groups,
		});

		const errors = await validate(channel);

		return value;
	}
}
