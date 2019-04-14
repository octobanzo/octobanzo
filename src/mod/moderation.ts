import { get as conf } from 'config';
import { Guild, GuildAuditLogs, GuildAuditLogsEntry, Message, RichEmbed, TextChannel, User } from 'discord.js';
import Bot from '../lib/bot';
import Logger from '../lib/logging';
import { Module } from '../lib/modules';
import { default as Utils } from '../lib/util';
import { CommandPermission, ICommandOptions } from './commands';

export default class Moderation extends Module {
    private app: Bot;

    constructor(app: Bot) {
        super({
            description: 'Assists server admins with moderation.',
            version: '0.0.1-dev',
        });

        this.app = app;

        this.handle('message', this.handleMessage);
        this.handle('guildBanAdd', this.handleBan);

        this.app.commands.add({
            name: 'warn',
            description: 'Assign a warning to a user.',
            aliases: ['warnings', 'unwarn'],
            type: 'guild',
            permission: CommandPermission.Moderator
        }, this.warnCommand.bind(this));
    }

    private async warnCommand(cmd: ICommandOptions, msg: Message, label: string, args: string[]): Promise<void> {
        if (msg.author.id !== this.app.owner.id) return;

        // warn logic; waiting for database implementation
    }

    private async handleMessage(msg: Message): Promise<void> {
        // TODO: Use LanguageProcessor to detect bad, give an overall score
    }

    private async handleBan(guild: Guild, user: User): Promise<void> {
        if (!conf('moderation.logs.events.ban')
            || !conf('moderation.logs.channel')) return;

        const timestamp = new Date();

        if (conf('moderation.auto_unban.enable')) {
            if ((conf('moderation.auto_unban.user_id') as string[]).includes(user.id)
                && guild.id === conf('moderation.auto_unban.guild_id')) {
                try {
                    guild.unban(user, 'Automatic unban for debugging. (bot debug)');
                    this.app.log.debug('Unbanned test user.', { user: user.tag, guild: guild.name });
                } catch (err) {
                    this.app.log.error(err, 'Could not unban test user.');
                }
            }
        }

        await Utils.delay(250); // Delay .25s before doing anything. (Allows audit log to update, it's slow af for some reason)

        let results: GuildAuditLogs;

        try {
            results = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD', limit: 1 });
        } catch (err) {
            this.app.log.error(err, 'Could not fetch audit log entry!');
            return;
        }

        const logChannel: TextChannel = guild.channels.get(conf('moderation.logs.channel')) as TextChannel;
        const result: GuildAuditLogsEntry = results.entries.first();
        let reason: string = result.reason;

        if (result.executor.id === this.app.user.id) return;

        if (!result.executor.bot && !reason)
            try {
                const responseChannel = await (result.executor.dmChannel || await result.executor.createDM());
                const awaitTime = 1000 * (conf('moderation.logs.reason_time') as number);
                await responseChannel.send(`Please tell me your reason for banning ${user.tag}. I'll wait ${Utils.formatTime(Utils.convertTime(awaitTime))} for your response.`);
                const response = await responseChannel.awaitMessages((msg: Message) => (msg.author.id !== this.app.user.id),
                    { max: 1, time: awaitTime });

                if (response.size > 0) {
                    response.map((msg) => { reason = msg.content; });
                    responseChannel.send(`Thanks, I'll include that in the logs.`);
                } else { // tslint:disable-line
                    responseChannel.send(`I didn't get a reason from you. None will be logged.`);
                    // TODO: Conditionally, tell person to ask admin to add reason or add themselves if admin
                }
            } catch (err) {
                this.app.log.error(err, 'Error fetching ban reason.');
            }

        const logAttachment = new RichEmbed({
            description: 'User Banned',
            color: 0xFF3333,
            fields: [{
                name: 'User',
                value: `\`${user.tag.replace('`', '\'')}\``,
                inline: true
            }, {
                name: 'Banned by',
                value: result.executor.tag,
                inline: true
            }, {
                name: 'Reason',
                value: reason || '<no reason provided>',
                inline: false
            }],
            timestamp
        });

        try {
            this.app.log.trace(`Sending ban ${result.id} log...`);
            await logChannel.send(logAttachment);
            this.app.log.trace(`Ban log for ${result.id} sent!`);
            return;
        } catch (err) {
            this.app.log.warn(err, 'Couldn\'t send ban log.');
            return;
        }
    }
}
