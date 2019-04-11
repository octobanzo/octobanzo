import { get as conf } from 'config';
import { Message } from 'discord.js';
import * as knex from 'knex';
import Bot from './bot';
import Logger from './logging';
import { Module } from './modules';

export default class Database {
    public lib: knex;

    private app: Bot;

    constructor(app: Bot) {
        this.lib = knex({
            client: conf('database.client'),
            connection: conf('database.connection')
        });

        this.app = app;

        // TODO: add database handling things!
    }
}
