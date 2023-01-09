import { LoggedUser } from '42.js/dist/structures/logged_user';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}

    async connectUser(user42: LoggedUser) {
        if (await this.userService.isUserWithLogin(user42.login)) {
            console.log('User already exists');
        } else {
            console.log('User does not exist, creating it');
        }
    }
}
