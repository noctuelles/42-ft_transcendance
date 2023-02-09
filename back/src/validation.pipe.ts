import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	ValidationPipeOptions,
	ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
	constructor(private readonly options?: ValidationPipeOptions) {}

	async transform(value: any, metadata: ArgumentMetadata) {
		const channel = plainToInstance(metadata.metatype, value);

		let groups = [];
		if (typeof channel.generateGroups === 'function') {
			groups = channel.generateGroups();
		}

		const validationPipe = new ValidationPipe({
			...this.options,
			groups,
		});

		return validationPipe.transform(value, metadata);
	}
}
