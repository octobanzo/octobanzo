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

    private async init(): Promise<void> {
        this.log.info('Bot started.')

        this.client.on('ready', async () => {
            this.user = this.client.user
            this.log.info(`Discord connected as ${this.user.tag}, id:${this.user.id}`)

            this.owner = (await this.client.fetchApplication()).owner

            this.database = new Database(this)

            this.modules.postInit()
        })

        this.client.on('error', async (err: Error) => {
            this.log.error(err, `Client error!`)
        })

        try {
            this.log.debug('Connecting to Discord...')

            await this.client.login(conf('discord.token'))
            this.client.user.setStatus('dnd')
                .catch(null)
        } catch (err) {
            this.log.error(err, 'Could not log into Discord!')
            return process.exit(1)
        }

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
            return process.exit(1)
        }

        this.client.user.setStatus('online')
            .catch(null)

        return
    }
}
