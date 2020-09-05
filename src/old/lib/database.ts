import { ICommandContext } from './commands.js';
import { Bot } from './bot';
import knex from 'knex';
import { Logger } from './logging.js';

export default class Database {
    public env = process.env.NODE_ENV;

    protected mongoose: mongoose.Connection;

    private connectUrl: string = 'mongodb://';

    constructor(private app: Bot) {
        this.connectUrl += `${encodeURIComponent(
            app.config.database.username
        )}:${encodeURIComponent(app.config.database.password)}@`;
        this.connectUrl += `${app.config.database.host}:${app.config.database.port}`;
        this.connectUrl += `/${app.config.database.db}`;
    }

    public async setup(): Promise<void> {
        try {
            Logger.info(
                `Connecting to database on ${this.app.config.database.host}:${this.app.config.database.port}...`
            );
            await mongoose.connect(this.connectUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            Logger.info('Database connected.');
        } catch (err) {
            Logger.error(err, 'Could not connect to database.');
            this.app.stop();
            return;
        }

        return;

        //! bot will connect to discord AFTER this point. do not do any bot user operations now
    }
}
