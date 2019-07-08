import { get as conf } from 'config'
import { Guild, GuildMember, Message, RichEmbed, UserResolvable } from 'discord.js'
import Bot from '../lib/bot'
import Logger from '../lib/logging'
import { Module } from '../lib/modules'

export default class Commands extends Module {
    public commandExecutors: Record<string, (command: ICommandOptions, msg: Message, label: string, args: string[]) => any> = {}
    public labels: Record<string, ICommandOptions> = {}
    public commandMeta: ICommandOptions[] = []

    private defaultPrefix: string = conf('commands.default_prefix') || '!'
    private app: Bot

    constructor(app: Bot) {
        super({
            version: '0.0.1',
            requiredSettings: 'commands'
        })

        this.app = app

        this.handle('message', this.handleMessage)
    }

    public async add(properties: ICommandOptions, func: (command: ICommandOptions, msg: Message, label: string, args: string[]) => any): Promise<Commands> {
        this.commandExecutors[properties.name.toLowerCase()] = func
        this.commandMeta.push(properties)
        this.labels[properties.name.toLowerCase()] = properties
        for (const alias of properties.aliases || []) {
            this.labels[alias] = properties
        }
        return this
    }

    public async canUse(user: UserResolvable, command: ICommandOptions | string): Promise<boolean> {
        // if label is provided, get command object
        if (typeof command === 'string') {
            command = this.labels[command]
        }

        // Resolve user
        if (user instanceof Message) {
            if (user.member) {
                user = user.member
            } else {
                user = user.author
            }
        } else if (user instanceof Guild) {
            user = user.owner
        } else if (typeof user === 'string') {
            user = await this.app.client.fetchUser(user)
        }

        // check if command type is guild, then if user is guild member
        if (command.type === 'guild'
            && !(user instanceof GuildMember)) {
            return false
        }

        if (command.permission === CommandPermission.User) {
            return true
        }

        if (command.permission === CommandPermission.AppOwner
            && user.id === this.app.owner.id) {
            return true
        }

        // if user is in a guild and permissions require role checks
        if (user instanceof GuildMember) {
            if (command.permission === CommandPermission.Moderator) {
                return (/* statement checking if user has role */ false)
            }

            if (command.permission === CommandPermission.Administrator) {
                return (/* statement checking if user has role */ false)
            }

            if (command.permission === CommandPermission.GuildOwner
                && user.id === user.guild.id) {
                return true
            }
        }

        return false
    }

    private async handleMessage(msg: Message): Promise<void> {
        if (msg.author.bot) {
            return
        }

        const prefix = this.defaultPrefix

        if (!msg.content.startsWith(prefix)) { return }

        const args = msg.content.split(' ')
        const label: string = args.shift().slice(prefix.length).toLowerCase()

        this.app.log.trace('Potential command!')
        if (Object.keys(this.labels || {}).includes(label)) {
            this.app.log.trace(`Executing command: ${label}`)
            const cmd = this.labels[label]
            try {
                if (!this.canUse(msg.author, cmd)) throw new Error('User cannot use this command')
                await this.commandExecutors[cmd.name](cmd, msg, label, args)
            } catch (err) {
                this.app.log.debug(err, 'Command failure')
                msg.channel.send(new RichEmbed({
                    color: 0xFF0000,
                    title: ':warning: **An error occurred!**',
                    description: `I couldn't execute that command.`,
                    fields: [{
                        name: 'Error Message',
                        value: err.message || err.msg || JSON.stringify(err, null, 2) || `${err}`,
                        inline: true
                    },
                    {
                        name: 'Error Type',
                        value: err.name || 'Error',
                        inline: true
                    }, {
                        name: 'Command',
                        value: `${prefix}${label}`,
                        inline: true
                    }, {
                        name: 'Executor',
                        value: `${msg.author}`,
                        inline: true
                    }],
                    footer: {
                        text: `Contact the bot owner (${this.app.owner.tag}) for help if you think this is a bug.`
                    }
                }))
                    .catch((err) => this.app.log.trace(err, 'Could not send error message.'))
            }
        }

        return
    }
}

export interface ICommandOptions {
    name: string
    description?: string
    type: CommandType
    permission: CommandPermission
    aliases?: string[]
    usage?: string
}

export type CommandType = 'guild' | 'user' | 'open'

export enum CommandPermission {
    User,
    Moderator,
    Administrator,
    GuildOwner,
    AppOwner
}
