/* eslint-disable no-console */

require('dotenv/config')

import { install as installSourceMap } from 'source-map-support'
import Bot from './lib/bot'

const args = process.argv.slice(2)

function run(): void {
	// override NODE_ENV if passed as argument
	args.length && (process.env.NODE_ENV = args[0].toLowerCase())

	if (!process.env.NODE_ENV) {
		console.error(
			'[ERR!] Please specify environment! Set NODE_ENV or supply environment as first argument.'
		)
		process.exit(1)
	}

	console.info('[INIT] Environment: ' + process.env.NODE_ENV)

	// Add source map logging if 'development'
	if (process.env.NODE_ENV === 'development')
		installSourceMap({
			environment: 'node'
		})

	const app = new Bot()

	process.on('uncaughtException', console.error)
	process.on('unhandledRejection', console.error)
	process.on('SIGINT', () => shutdown(app))
	process.on('SIGKILL', () => shutdown(app))
	process.on('SIGTERM', () => shutdown(app))
}

function shutdown(app: Bot): never {
	app.log.info('Shutting down')

	try {
		app.log.debug('Destroying client')
		app.client.destroy()
		console.info('Goodbye!')
		return process.exit(0)
	} catch (err) {
		return process.exit(1)
	}
}

run()
