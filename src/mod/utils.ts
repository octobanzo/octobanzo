import * as config from "config";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

const debug = Logger.debugLogger("module:utils");

export default class Utils extends Module {
    constructor(app: Bot) {
        super({
            description: "Miscellaneous utilities for the bot.",
            name: "Utilities",
            version: "0.0.1",
        });

        app.commands.add({
            name: "eval",
        }, async (cmd, msg, label, args) => {
            if ((msg.author.id !== config.get("utils.owner_id") || "") || msg.author.bot) { return; }
            const evalString = args.join(" ");
            let output = `no output`;
            try {
                output = eval(evalString); // tslint:disable-line:no-eval
            } catch (err) {
                output = `Error: ${err.message}\nSee log for more info.`;
                app.log.info(err, `Error while evaluating expression from chat.`);
            }
            msg.channel.send(`Eval output\n\`\`\`${output}\`\`\``);
        });
    }
}
