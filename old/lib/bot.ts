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
    public owners: Discord.User[];

    // Core components
    public configuration: ConfigurationManager;
    public config: ConfigSchema;

    // Core modules
    public modules: ModuleManager;
    public database: Database;
    public commands: Commands;

    constructor(private options?: BotOptions) {
        this.configuration = new ConfigurationManager(this);
        this.config = this.configuration.value;
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
        // Logger.info('Bot starting, please wait');

        this.client.on('error', async (err: Error) => {
            Logger.error(err, 'Client error!');
        });

        // this.database = new Database(this);
        // await this.database.setup();

        this.client.on('ready', async () => {
            this.user = this.client.user;
            Logger.info(`Discord connected as ${this.user.tag}, id:${this.user.id}`);

            const owner = (await this.client.fetchApplication()).owner;

            // owned by a team
            if (owner instanceof Discord.User) this.owners = [owner];
            else if (owner instanceof Discord.Team)
                this.owners = Array.from(owner.members.values()).map(
                    (owner) => owner.user
                );

            // TODO: refactor module loader to read mod/ directory
            try {
                Logger.verbose('Registering modules...');

                for (const mod of []) {
                    Logger.debug(`Registering module ${mod.name}`);

                    const instance = new mod(this);
                    this.modules.add(instance);

                    if (mod.name === 'Commands') {
                        this.commands = instance as Commands;
                    }
                }

                this.modules.init(this.client);
                Logger.info('Modules registered.');
            } catch (err) {
                Logger.error(err, 'Error setting up modules.');
                return this.stop(1);
            }

            this.client.user.setStatus('online').catch(null);

            this.modules.postInit();
        });

        try {
            Logger.debug('Connecting to Discord...');

            await this.client.login(this.config.discord.token);
            this.client.user.setStatus('idle').catch(null);
        } catch (err) {
            Logger.error(err, 'Could not log into Discord!');
            return this.stop(1);
        }

        return;
    }

    public isOwner(
        user: Discord.User | Discord.GuildMember | Discord.Snowflake
    ): boolean {
        let id: Discord.Snowflake = user as Discord.Snowflake;

        if (user instanceof Discord.User || user instanceof Discord.GuildMember)
            id = user.id;

        return this.owners.map((owner) => owner.id).includes(id);
    }
}
