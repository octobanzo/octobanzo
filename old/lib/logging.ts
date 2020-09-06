import * as chalk from 'chalk';

export enum LogLevel {
    DEBUG,
    VERBOSE,
    INFO,
    WARNING,
    ERROR
}

// console.log(LogLevel[LogLevel[process.env.NODE_LOG_LEVEL]], { LogLevel });

export class Logger {
    public static minimumLevel: () => LogLevel = () =>
        process.env.NODE_LOG_LEVEL ? LogLevel[process.env.NODE_LOG_LEVEL] : LogLevel.INFO;

    private static doLog(level: LogLevel, ...inputs: any[]): void {
        if (level < this.minimumLevel()) return;

        let logMethod: typeof console.log = console.log;

        if (level === LogLevel.INFO) console.info;
        if (level === LogLevel.WARNING) console.warn;
        if (level >= LogLevel.ERROR) console.error;

        logMethod(...inputs);
    }

    public static log(...args: any[]) {
        return this.doLog(LogLevel.INFO, ...args);
    }

    public static info(...args: any[]) {
        return this.doLog(LogLevel.INFO, chalk.bgCyan.black(' INFO '), ...args);
    }
    public static warn(...args: any[]) {
        return this.doLog(LogLevel.WARNING, chalk.bgYellow.white(' WARN '), ...args);
    }
    public static error(...args: any[]) {
        return this.doLog(LogLevel.ERROR, chalk.bgRed.white(' ERROR '), ...args);
    }

    public static verbose(...args: any[]) {
        return this.doLog(LogLevel.VERBOSE, chalk.bgMagenta.black(' VERBOSE '), ...args);
    }
    public static debug(...args: any[]) {
        return this.doLog(LogLevel.DEBUG, chalk.black.white(' DEBUG '), ...args);
    }
}
