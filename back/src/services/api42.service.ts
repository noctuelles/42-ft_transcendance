import { Client } from '42.js';
import { AuthProcess } from '42.js/dist/auth/auth_manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Api42Service {
    private _client: Client;
    private _auth_processes: AuthProcess;

    constructor() {
        this._client = new Client(
            <string>process.env.API_CLIENT_ID,
            <string>process.env.API_CLIENT_SECRET,
        );
    }

    get client(): Client {
        return this._client;
    }

    async get_auth_processes(): Promise<AuthProcess> {
        if (!this._auth_processes) {
            this._auth_processes =
                await this.client.auth_manager.init_auth_process(
                    process.env.SELF_URL + '/auth/callback',
                    ['public'],
                );
        }
        return this._auth_processes;
    }
}
