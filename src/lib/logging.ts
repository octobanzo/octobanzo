import { get as conf } from 'config'
import { join } from 'path'
import * as pino from 'pino'

export default class Logger {
    public lib: pino.Logger

    constructor() {
        this.lib = pino({
            level: process.env.LEVEL || 'info'
        }, conf('logging.file')
                ? pino.destination(join(__dirname, 'app.log')) : undefined)
    }
}
