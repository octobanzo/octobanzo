import { Message } from "discord.js";
import Bot from "../lib/bot";
import { Module } from "../lib/modules";

export default class Moderation extends Module {
    constructor(app: Bot) {
        super({
            description: "Assists server admins with moderation via machine learning.",
            name: "Moderation",
            version: "0.0.1-dev",
        });

        this.handle("message", (msg: Message) => {
            // TODO: Moderation message handler
        });
    }
}
