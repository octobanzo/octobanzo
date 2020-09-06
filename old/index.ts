/* eslint-disable no-console */

import { install as installSourceMap } from 'source-map-support';
import { Bot } from './lib/bot';
import { Logger } from './lib/logging';

const args = process.argv.slice(2);

module.exports.run = function (): void {
    // override NODE_ENV if passed as argument
    args.length && (process.env.NODE_ENV = args[0].toLowerCase());

    if (!process.env.NODE_ENV) {
        Logger.error(
            'Please specify environment! Set NODE_ENV or supply environment as first argument.'
        );
        process.exit(1);
    }

    Logger.info('Environment: ' + process.env.NODE_ENV);

    // Add source map logging if 'development'
    if (process.env.NODE_ENV.startsWith('dev'))
        installSourceMap({
            environment: 'node'
        });

    const app = new Bot();

    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
    process.on('SIGINT', () => shutdown(app));
    // process.on('SIGKILL', () => shutdown(app))
    process.on('SIGTERM', () => shutdown(app));
};

function shutdown(app: Bot): never {
    Logger.info('Shutting down');

    try {
        Logger.debug('Destroying client');
        app.client.destroy();
        Logger.log('Bye!');
        return process.exit(0);
    } catch (err) {
        return process.exit(1);
    }
}
