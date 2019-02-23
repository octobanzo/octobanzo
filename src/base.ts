import { final } from "pino";
import Bot from "./lib/bot";
import Logger from "./lib/logging";
import { debug as debugLib } from "debug";

const args = process.argv.slice(2);
const debug = Logger.debugLogger("runner:base");

function start(): void {
    debug("App started.");

    // override NODE_ENV if passed as argument
    if (args.length > 0) {
        process.env.NODE_ENV = args[0].toLowerCase();
    } else if (!process.env.NODE_ENV) {
        console.error("ERROR: Please specify environment! Set NODE_ENV or supply environment as first argument.");
        process.exit(1);
    }

    // Add source map logging if 'development'
    if (process.env.NODE_ENV === "development") {
        require("source-map-support").install({
            environment: "node"
        });
        debug("Enabled source map support for stack traces.");
    }

    const app = new Bot();

    process.on("uncaughtException", app.log.error);
    process.on("unhandledRejection", app.log.warn);
    process.on("SIGINT", () => shutdown(app));

    debug("Initialization completed. Running");
    return;
}

function shutdown(app: Bot): never {
    debug("Shutting down...");
    try {
        debug("Destroying client");
        app.client.destroy();
        debug("Client destroyed.");
        return process.exit(0);
    } catch (err) {
        return process.exit(1);
    }
}

start();
