import { get as conf } from 'config'
import { Channel, DiscordAPIError, Message, RichEmbed, TextChannel, Util } from 'discord.js'
import Bot from '../lib/bot'
import Logger from '../lib/logging'
import { Module } from '../lib/modules'
import Utilities from '../lib/util'
import { CommandPermission, ICommandContext, ICommandOptions } from './commands'

export default class Utils extends Module {
    private app: Bot

    constructor(app: Bot) {
        super({
            description: 'Miscellaneous utilities for the bot.',
            version: '0.0.1',
        })

        this.app = app

        app.commands.add({
            name: 'eval',
            aliases: ['evaluate', 'expression'],
            description: 'Evaluate a JavaScript expression.',
            usage: '<expression...>',
            type: 'open',
            permission: CommandPermission.AppOwner
        }, this.runEval.bind(this))

        app.commands.add({
            name: 'help',
            aliases: ['?'],
            description: 'Get a list of available commands.',
            type: 'open',
            permission: CommandPermission.User
        }, this.runHelp.bind(this))

        app.commands.add({
            name: 'spacify',
            aliases: ['spaceme', 'space'],
            description: 'Add spaces to a channel\'s name',
            usage: '<channel>',
            type: 'guild',
            permission: CommandPermission.Administrator
        }, this.runSpacify.bind(this))
    }

    private async runHelp(cmd: ICommandOptions, msg: Message, label: string, args: string[], ctx: ICommandContext): Promise<void> {
        const commandsPerPage = 8
        const chunks: ICommandOptions[][] = Utilities.chunkArray(this.app.commands.commandMeta, commandsPerPage)

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            const fields: Array<{ name: string; value: string; inline?: boolean; }> = []

            for (const command of chunk) {
                if (!(await this.app.commands.canUse(msg.member || msg.author, command))) {
                    continue
                }

                let cmdDescription = `${command.description || ''}`

                if (command.usage) {
                    cmdDescription += `\n_Usage: ${ctx.prefix}${command.name} ${command.usage}_`
                }

                if (command.aliases && command.aliases.length) {
                    cmdDescription += `\n_Also: ${ctx.prefix}${command.aliases.join(`, ${ctx.prefix}`)}_`
                }

                fields.push({
                    name: `${ctx.prefix}${command.name}`,
                    value: cmdDescription,
                    inline: false
                })
            }

            try {
                if (msg.channel.type === 'text') {
                    msg.delete(3000)
                        .catch(() => null)
                        ;

                    (await msg.channel.send(`Check your DMs ${msg.author}! Command help should arrive shortly. :mailbox_with_mail:`) as Message)
                        .delete(3500)
                        .catch(() => null)
                }

                await msg.author.send(new RichEmbed({
                    title: `Commands - page ${i + 1}`,
                    description: `All the commands you can use ${(msg.guild ? `in **${msg.guild.name}**` : 'here')}:`,
                    color: 0x0086FF,
                    fields
                }))
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    msg.reply(`I'm having issues DMing you. Please make sure you have messages for this server on!`,
                        {
                            embed: new RichEmbed({
                                title: `:mailbox_closed: Some error info...`,
                                description: `${err.code}: ${err.message}`,
                                color: 0xFF8866
                            })
                        })
                } else {
                    throw err
                }
            }

            await Utilities.delay(350) // wait 350ms between pages, discord ratelimiting
        }
    }

    private async runSpacify(cmd, msg, label, args): Promise<void> {
        const channelMatchExpression = /(?:<#)?([0-9]{12,})>?/g
        const channels: any[] = []

        if (args.length >= 1) {
            for (const arg of args) {
                const match = channelMatchExpression.exec(arg)

                if (match && match.length > 0) {
                    channels.push(this.app.client.channels.get(match[1]))
                }
            }
        } else if (args.length === 0) {
            channels.push(msg.channel)
        }

        for (const channel of channels) {
            try {
                if (channel instanceof TextChannel) {
                    if (!channel.name.includes('-')) {
                        throw new Error('No dashes in channel name')
                    }

                    const oldName = `${channel.name} `

                    try {
                        await channel.setName(oldName.replace('-', `\u2009\u2009`))
                        msg.channel.send(`Changed **${oldName}**'s name to **${channel.name}**.`)
                    } catch (err) {
                        throw err
                    }
                } else {
                    throw new TypeError('Must be a text channel')
                }
            } catch (err) {
                throw err
            }
        }

        return
    }

    private async runEval(cmd, msg, label, args): Promise<void> {
        if (msg.author.id !== this.app.owner.id) { return }

        const evalString = args.join(' ')
        let output = `<NO OUTPUT GIVEN>`

        try {
            output = eval(evalString) // tslint:disable-line:no-eval
        } catch (err) {
            throw err
        }

        msg.channel.send(`Eval output\n\`\`\`${output}\`\`\``)
    }
}
