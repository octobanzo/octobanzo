import * as config from "config";
import * as devLog from "debug";
import * as pino from "pino";

export default class Logger {
    public lib: pino.Logger;

    constructor() {
        this.lib = pino({
            prettyPrint: config.get("logging.file")
                ? false : true,
        }, config.get("logging.file")
                ? pino.destination("./log/log.log") : undefined);
    }

    public static debugLogger(namespace: string): devLog.Debugger {
        return devLog(namespace);
    }
}
