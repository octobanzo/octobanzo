import { get as conf } from "config";
import { Message } from "discord.js";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";
import * as knex from "knex";

export default class Database extends Module {
    public lib: knex;

    private app: Bot;
    private tables;

    constructor(app: Bot) {
        super({
            requiredSettings: "database",
            version: "0.0.1",
        });

        this.lib = knex({
            client: conf("database.client"),
            connection: conf("database.connection")
        });

        this.app = app;

        // TODO: add database handling things!
    }
}
