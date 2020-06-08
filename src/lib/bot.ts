import { get as conf } from 'config'
import * as Discord from 'discord.js'
import * as pino from 'pino'
import modulesList from '../mod/_index'
import Commands from '../mod/commands'
import Database from './database'
import Logger from './logging'
import { ModuleManager } from './modules'

export default class Bot {
	public client: Discord.Client
	public database: Database
	public user: Discord.ClientUser
	public log: pino.Logger
	public modules: ModuleManager
	public commands: Commands
	public owner: Discord.User

	constructor() {
		this.log = new Logger().lib
		this.modules = new ModuleManager(this)

		this.client = new Discord.Client({
			disableEveryone: true,
			disabledEvents: [
				'PRESENCE_UPDATE',
				'TYPING_START',
			],
		})

		this.init()
	}

	public async stop(exitCode: number = 0): Promise<void> {
		return process.exit(exitCode)
	}

	private async init(): Promise<void> {
		this.log.info('Bot starting, please wait')

		this.client.on('error', async (err: Error) => {
			this.log.error(err, 'Client error!')
		})

		this.database = new Database(this)
		await this.database.setup()

		this.client.on('ready', async () => {
			this.user = this.client.user
			this.log.info(`Discord connected as ${this.user.tag}, id:${this.user.id}`)

			this.owner = (await this.client.fetchApplication()).owner

			if (this.owner.discriminator === '0000' === this.owner.username.startsWith('team'))
				this.owner = await this.client.fetchUser(conf('discord.ownerID'))

			try {
				this.log.debug('Registering modules...')

				for (const mod of modulesList) {
					this.log.trace(`Registering module ${mod.name}`)

					const instance = new mod(this)
					this.modules.add(instance)

					if (mod.name === 'Commands') { this.commands = instance as Commands }
				}

				this.modules.init(this.client)
				this.log.info('Modules registered.')
			} catch (err) {
				this.log.error(err, 'Error setting up modules.')
				return this.stop(1)
			}

			this.client.user.setStatus('online')
				.catch(null)

			this.modules.postInit()
		})

		try {
			this.log.debug('Connecting to Discord...')

			await this.client.login(conf('discord.token'))
			this.client.user.setStatus('idle')
				.catch(null)
		} catch (err) {
			this.log.error(err, 'Could not log into Discord!')
			return this.stop(1)
		}

		return
	}
}
