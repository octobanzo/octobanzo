import { get as conf } from "config";
import { Message } from "discord.js";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

export default class Database extends Module {
    private app: Bot;

    constructor(app: Bot) {
        super({
            requiredSettings: "database",
            version: "0.0.1",
        });

        this.app = app;

        // TODO: add database handling things!
    }
}
