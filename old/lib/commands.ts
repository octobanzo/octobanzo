import {
    Guild,
    GuildMember,
    Message,
    User,
    MessageEmbedOptions,
    MessageEmbed
} from 'discord.js';
import { Bot } from './bot';
import { Module } from './modules';
import { Logger } from './logging';

export class Commands extends Module {
    public commandFunctions: Record<string, CommandFunction> = {};
    public labels: Record<string, ICommandOptions> = {};
    public commandMeta: ICommandOptions[] = [];

    private defaultPrefix: string = this.app.config.defaults.commands.prefix;

    constructor(private app: Bot) {
        super(
            {
                version: '0.0.1',
                requiredSettings: 'commands'
            },
            app
        );

        this.handle('message', this.handleMessage);
    }

    public async add(
        properties: ICommandOptions,
        func: CommandFunction
    ): Promise<Commands> {
        this.commandFunctions[properties.name.toLowerCase()] = func;
        this.commandMeta.push(properties);
        this.labels[properties.name.toLowerCase()] = properties;
        for (const alias of properties.aliases || []) {
            this.labels[alias] = properties;
        }
        return this;
    }

    public async canUse(
        user: User | GuildMember,
        command: ICommandOptions | string
    ): Promise<boolean> {
        // if label is provided, get command object
        if (typeof command === 'string') {
            command = this.labels[command];
        }

        // Resolve user
        if (user instanceof Message) {
            user = user.member || user.author;
        }

        Logger.debug('Commands', 'User resolved');

        // check if command type is guild, then if user is guild member
        if (command.type === 'guild' && !(user instanceof GuildMember)) {
            return false;
        }

        Logger.debug('Commands', 'Guild perm test passed');

        if (command.permission === CommandPermission.User) {
            return true;
        }

        Logger.debug('Commands', 'User perm test failed');

        if (
            command.permission === CommandPermission.AppOwner &&
            this.app.isOwner(user.id)
        ) {
            Logger.debug('Commands', 'Owner perm test passed');
            return true;
        }

        // if user is in a guild and permissions require role checks
        if (user instanceof GuildMember) {
            if (command.permission === CommandPermission.Moderator) {
                // bypass app owner until role checks exist
                return this.app.isOwner(user.id);
            }

            if (command.permission === CommandPermission.Administrator) {
                // bypass app owner until role checks exist
                return this.app.isOwner(user.id);
            }

            if (
                command.permission === CommandPermission.GuildOwner &&
                user.id === user.guild.ownerID
            ) {
                return true;
            }
        }

        return false;
    }

    private async handleMessage(msg: Message): Promise<void> {
        if (msg.author.bot) {
            return;
        }

        const prefix = this.defaultPrefix;
        // const db = this.app.database.knex

        if (msg.guild) {
            try {
                // const res = db('guilds')
                //     .where({
                //         discord_id: msg.guild.id
                //     })
                //     .select('prefix')
                // console.log(JSON.stringify(res, null, 2))
            } catch (err) {
                null;
            }
        }

        if (!msg.content.startsWith(prefix)) {
            return;
        }

        const args = msg.content.split(' ');
        const label: string = args.shift().slice(prefix.length).toLowerCase();

        Logger.debug('Potential command!', { label });

        if (Object.keys(this.labels).includes(label)) {
            Logger.verbose(`Executing command: ${label}`);

            const cmd: ICommandOptions = this.labels[label];
            const context: ICommandContext = {
                prefix,
                author: msg.member || msg.author,
                guild: msg.guild,
                message: msg
            };

            try {
                if (!(await this.canUse(msg.member || msg.author, cmd))) {
                    throw new Error("Can't use this command here!");
                }

                await this.commandFunctions[cmd.name](cmd, msg, label, args, context);
            } catch (err) {
                Logger.verbose(err, 'Command failure');

                const errorMsg =
                    err.message || err.msg || JSON.stringify(err, null, 2) || `${err}`;

                let errorEmbed: MessageEmbedOptions = {
                    color: 0xff0000,
                    title: ':warning: **Oops!**',
                    description: errorMsg,
                    footer: {
                        text: `Contact the bot owner (${this.app.owners[0].tag}) for help if you think this is a bug.`
                    }
                };

                if (this.app.isOwner(msg.author.id)) {
                    const newOptions: MessageEmbedOptions = {
                        title: `:warning: **${err.name}!**`,
                        footer: {
                            text: `You did this to me, @${msg.author.username}!`
                        }
                    };

                    errorEmbed = Object.assign({}, errorEmbed, newOptions);
                }

                msg.channel
                    .send(new MessageEmbed(errorEmbed))
                    .catch((err) => Logger.verbose(err, 'Could not send error message.'));
            }
        }
    }
}

export interface ICommandOptions {
    name: string;
    description?: string;
    type: 'guild' | 'user' | 'open';
    permission: CommandPermission;
    aliases?: string[];
    usage?: string;
}

export interface ICommandContext {
    prefix: string;
    message: Message;
    guild: Guild | undefined;
    author: GuildMember | User;
}

export type CommandFunction = (
    command: ICommandOptions,
    msg: Message,
    label: string,
    args: string[],
    context?: ICommandContext
) => any;

export enum CommandPermission {
    User,
    Moderator,
    Administrator,
    GuildOwner,
    AppOwner
}
