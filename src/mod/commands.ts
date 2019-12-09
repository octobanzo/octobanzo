import { get as conf } from 'config'
import { Guild, GuildMember, Message, RichEmbed, RichEmbedOptions, User, UserResolvable } from 'discord.js'
import Bot from '../lib/bot'
import Logger from '../lib/logging'
import { Module } from '../lib/modules'

export default class Commands extends Module {
    public commandFunctions: Record<string, CommandFunction> = {}
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

    public async add(properties: ICommandOptions, func: CommandFunction): Promise<Commands> {
        this.commandFunctions[properties.name.toLowerCase()] = func
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
            user = user.member || user.author
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
                return (user.id === this.app.owner.id)
            }

            if (command.permission === CommandPermission.Administrator) {
                return (user.id === this.app.owner.id)
            }

            if (command.permission === CommandPermission.GuildOwner
                && user.id === user.guild.ownerID) {
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

            const cmd: ICommandOptions = this.labels[label]
            const context: ICommandContext = {
                prefix,
                author: msg.member || msg.author,
                guild: msg.guild,
                message: msg
            }

            try {
                if (!(await this.canUse(msg.member || msg.author, cmd))) {
                    throw new Error(`Can't use this command here!`)
                }

                await this.commandFunctions[cmd.name](cmd, msg, label, args, context)
            } catch (err) {
                this.app.log.debug(err, 'Command failure')

                const errorMsg = err.message || err.msg || JSON.stringify(err, null, 2) || `${err}`

                let errorEmbed: RichEmbedOptions = {
                    color: 0xFF0000,
                    title: ':warning: **Oops!**',
                    description: errorMsg,
                    footer: {
                        text: `Contact the bot owner (${this.app.owner.tag}) for help if you think this is a bug.`
                    }
                }

                if (msg.author.id === this.app.owner.id) {
                    const newOptions: RichEmbedOptions = {
                        title: `:warning: **${err.name}!**`,
                        footer: {
                            text: `You did this to me, @${msg.author.username}!`
                        }
                    }

                    errorEmbed = Object.assign({}, errorEmbed, newOptions)
                }

                msg.channel.send(new RichEmbed(errorEmbed))
                    .catch((err) => this.app.log.trace(err, 'Could not send error message.'))
            }
        }
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

export interface ICommandContext {
    prefix: string,
    message: Message,
    guild: Guild | undefined,
    author: GuildMember | User
}
export type CommandType = 'guild' | 'user' | 'open'

export type CommandFunction = (command: ICommandOptions, msg: Message, label: string, args: string[], context?: ICommandContext) => any

export enum CommandPermission {
    User,
    Moderator,
    Administrator,
    GuildOwner,
    AppOwner
}
