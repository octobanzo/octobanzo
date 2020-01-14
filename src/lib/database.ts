import { get as conf } from 'config'
import { Guild, Message } from 'discord.js'
import * as knex from 'knex'
import knexconfig from '../../config/db.js'
import { ICommandContext } from '../mod/commands.js'
import Bot from './bot'
import Logger from './logging'
import { Module } from './modules'

export default class Database {
    public env = process.env.NODE_ENV
    public knex: knex

    private config: object = knexconfig[this.env]
    private app: Bot

    constructor(app: Bot) {
        this.app = app

        this.knex = knex(this.config)

        this.setup()
    }

    public async setup(): Promise<void> {
        let versionQuery

        try {
            versionQuery = await this.knex.raw('select version()')
            await this.knex.migrate.latest()
        } catch (err) {
            this.app.log.error(err, 'Couldn\'t fetch database version')
            process.exit(1)
        }
        const version = versionQuery[0][0]['version()']

        await this.app.owner.send(
            `Connected to database, version ${version}`
        )
    }

    public async cacheGuild(context: ICommandContext): Promise<void> {
        // const qRecords: knex.QueryBuilder = await this.knex('guilds').where({
        //     discord_id: context.guild.id
        // })

        // console.log(JSON.stringify(qRecords, null, 2))

        // qRecords.row
    }
}
