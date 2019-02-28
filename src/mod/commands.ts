import { get as conf } from "config";
import { Message } from "discord.js";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

export default class Commands extends Module {
    private commands: Record<string, (command: ICommandOptions, msg: Message, label: string, args: string[]) => any> = {};
    private labels: Record<string, ICommandOptions> = {};
    private defaultPrefix: string = conf("commands.default_prefix") || "!";
    private app: Bot;

    constructor(app: Bot) {
        super({
            version: "0.0.1",
            requiredSettings: "commands"
        });

        this.app = app;

        this.handle("message", this.handleMessage);
    }

    public async add(properties: ICommandOptions, func: (command: ICommandOptions, msg: Message, label: string, args: string[]) => any) {
        this.commands[properties.name.toLowerCase()] = func;
        this.labels[properties.name.toLowerCase()] = properties;
        for (const alias of properties.aliases || []) {
            this.labels[alias] = properties;
        }
    }

    private async handleMessage(msg: Message): Promise<void> {
        if (msg.author.bot) {
            return;
        }

        const prefix = this.defaultPrefix;

        if (!msg.content.startsWith(prefix)) { return; }

        const args = msg.content.split(" ");
        const label: string = args.shift().slice(prefix.length).toLowerCase();

        this.app.log.trace("Potential command!");
        if (Object.keys(this.labels || {}).includes(label)) {
            this.app.log.trace("Command found!");
            this.commands[this.labels[label].name](this.labels[label], msg, label, args);
        }

        return;
    }
}

export interface ICommandOptions {
    name: string;
    description?: string;
    aliases?: string[];
}
