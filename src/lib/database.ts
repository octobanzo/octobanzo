import { get as conf } from 'config'
import { Guild, Message } from 'discord.js'
import { ICommandContext } from '../mod/commands.js'
import Bot from './bot'
import Logger from './logging'
import { Module } from './modules'

export default class Database {
    public env = process.env.NODE_ENV

    private app: Bot

    constructor(app: Bot) {
        this.app = app


        this.setup()
    }

    public async setup(): Promise<void> {


        await this.app.owner.send(
            `Connected to database, version ${0x00FF00}`
        )
    }

    public async cacheGuild(context: ICommandContext): Promise<void> {

    }
}
