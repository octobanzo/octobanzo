import { get as conf } from 'config'
import { ICommandContext } from '../mod/commands.js'
import Bot from './bot'
import * as mongoose from 'mongoose'

export default class Database {
	public env = process.env.NODE_ENV

	protected mongoose: mongoose.Connection

	private app: Bot
	private connectUrl: string = 'mongodb://'

	constructor(app: Bot) {
		this.app = app

		this.connectUrl += `${encodeURIComponent(conf('database.username'))}:${encodeURIComponent(conf('database.password'))}@`
		this.connectUrl += `${conf('database.host')}:${conf('database.port')}`
		this.connectUrl += `/${conf('database.db')}`
	}

	public async setup(): Promise<void> {
		try {
			this.app.log.info(`Connecting to database on ${conf('database.host')}:${conf('database.port')}...`)
			await mongoose.connect(
				this.connectUrl,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true
				}
			)
			this.app.log.info('Database connected.')
		} catch (err) {
			this.app.log.fatal(err, 'Could not connect to database.')
			this.app.stop()
			return
		}

		return

		//! bot will connect to discord AFTER this point. do not do any bot user operations now
	}

	public async cacheGuild(context: ICommandContext): Promise<void> {

	}
}
