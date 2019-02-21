import { final } from "pino";
import Bot from "./lib/bot";
import Logger from "./lib/logging";

const debug = Logger.debugLogger("runner:base");

export function run(): void {
    const app = new Bot();

    process.on("uncaughtException", app.log.error);
    process.on("unhandledRejection", app.log.warn);
    process.on("SIGINT", () => shutdown(app));

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
