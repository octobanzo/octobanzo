import { get as conf } from 'config';
import Bot from '../lib/bot';
import Logger from '../lib/logging';
import { Module } from '../lib/modules';
import { CommandPermission } from './commands';

export default class Utils extends Module {
    private app: Bot;

    constructor(app: Bot) {
        super({
            description: 'Miscellaneous utilities for the bot.',
            version: '0.0.1',
        });

        this.app = app;

        app.commands.add({
            name: 'eval',
            aliases: ['evaluate', 'expression'],
            description: 'Evaluate a JavaScript expression.',
            usage: '<expression>',
            type: 'open',
            permission: CommandPermission.AppOwner
        }, this.evalCommand.bind(this));

        app.commands.add({
            name: 'help',
            aliases: ['?'],
            description: 'Get a list of commands and help with how to use them.',
            usage: '[command]',
            type: 'open',
            permission: CommandPermission.User
        }, this.helpCommand.bind(this));
    }

    private async helpCommand(cmd, msg, label, args): Promise<void> {
        // skeleton. add logic later
        return;
    }

    private async evalCommand(cmd, msg, label, args): Promise<void> {
        if (msg.author.id !== this.app.owner.id) { return; }

        const evalString = args.join(' ');
        let output = `<NO OUTPUT GIVEN>`;

        try {
            output = eval(evalString); // tslint:disable-line:no-eval
        } catch (err) {
            output = `Error: ${err.message}\nSee log for more info.`;
            this.app.log.info(err, `Error while evaluating expression from chat.`);
        }

        msg.channel.send(`Eval output\n\`\`\`${output}\`\`\``);
    }
}
