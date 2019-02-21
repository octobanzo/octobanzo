import { get as conf } from "config";
import * as debug from "debug";
import { join } from "path";
import * as pino from "pino";

export default class Logger {
    public lib: pino.Logger;

    constructor() {
        this.lib = pino({
            level: process.env.LEVEL || "info",
            prettyPrint: conf("logging.file")
                ? false : true,
        }, conf("logging.file")
                ? pino.destination(join(__dirname, "app.log")) : undefined);
    }

    public static debugLogger(namespace: string): debug.Debugger {
        return debug(namespace);
    }
}
