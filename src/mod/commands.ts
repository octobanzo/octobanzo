import * as config from "config";
import { Message } from "discord.js";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

const debug = Logger.debugLogger("module:commands");

export default class Commands extends Module {
    private commands: Record<string, (command: ICommandOptions, msg: Message, label: string, args: string[]) => any> = {};
    private labels: Record<string, ICommandOptions> = {};
    private defaultPrefix: string = config.get("commands.default_prefix") || "!";

    constructor(app: Bot) {
        super({
            description: "Adds command support.",
            name: "Commands",
            version: "0.0.1",
        });

        this.handle("message", this.handleMessage);

        this.add({
            aliases: ["gamer"],
            name: "test",
        }, (command, msg, label, args) => {
            msg.reply("yo soy botto bueno");
        });
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

        if (!msg.content.startsWith(prefix)) {
            return;
        }

        const args = msg.content.split(" ");
        const label: string = args.shift().slice(prefix.length).toLowerCase();

        debug("Potential command!");
        if (Object.keys(this.labels || {}).includes(label)) {
            debug("Command found!");
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
