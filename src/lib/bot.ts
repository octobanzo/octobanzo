import { ConfigurationManager, ConfigSchema } from './configuration';
import * as Discord from 'discord.js';
import { Commands } from './commands';
import Database from './database';
import { Logger } from './logging';
import { ModuleManager } from './modules';

export interface BotOptions {}

export class Bot {
    // Discord properties
    public client: Discord.Client;
    public user: Discord.ClientUser;
    public owner: Discord.User;

    // Core components
    public configuration: ConfigurationManager;
    public config: ConfigSchema;
    public log: Logger;

    // Core modules
    public modules: ModuleManager;
    public database: Database;
    public commands: Commands;

    constructor(private options?: BotOptions) {
        this.configuration = new ConfigurationManager(this);
        this.log = new Logger();
        this.modules = new ModuleManager(this);

        this.client = new Discord.Client({
            disableMentions: 'everyone'
            // disabledEvents: ['PRESENCE_UPDATE', 'TYPING_START']
        });

        this.init();
    }

    public async stop(stopCode: number = 0): Promise<void> {
        return process.exit(stopCode);
    }

    private async init(): Promise<void> {
        // this.log.info('Bot starting, please wait');

        this.client.on('error', async (err: Error) => {
            this.log.error(err, 'Client error!');
        });

        this.database = new Database(this);
        await this.database.setup();

        this.client.on('ready', async () => {
            this.user = this.client.user;
            this.log.info(`Discord connected as ${this.user.tag}, id:${this.user.id}`);

            this.owner = (await this.client.fetchApplication()).owner;

            // owned by a team
            if (this.owner instanceof Discord.Team)
                this.owner = await this.client.users.fetch(conf('discord.ownerID'));

            try {
                this.log.debug('Registering modules...');

                for (const mod of modulesList) {
                    this.log.trace(`Registering module ${mod.name}`);

                    const instance = new mod(this);
                    this.modules.add(instance);

                    if (mod.name === 'Commands') {
                        this.commands = instance as Commands;
                    }
                }

                this.modules.init(this.client);
                this.log.info('Modules registered.');
            } catch (err) {
                this.log.error(err, 'Error setting up modules.');
                return this.stop(1);
            }

            this.client.user.setStatus('online').catch(null);

            this.modules.postInit();
        });

        try {
            this.log.debug('Connecting to Discord...');

            await this.client.login(conf('discord.token'));
            this.client.user.setStatus('idle').catch(null);
        } catch (err) {
            this.log.error(err, 'Could not log into Discord!');
            return this.stop(1);
        }

        return;
    }
}
