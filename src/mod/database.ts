import { get as conf } from "config";
import { Message } from "discord.js";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

const debug = Logger.debugLogger("module:database");

export default class Database extends Module {
    constructor(app: Bot) {
        super({
            requiredSettings: "database",
            version: "0.0.1",
        });

        // TODO: add database handling things!
    }
}
