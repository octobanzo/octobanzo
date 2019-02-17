import { final } from "pino";
import Bot from "./lib/bot";
import Logger from "./lib/logging";

const debug = Logger.debugLogger("runner:base");

export function run(): void {
    const app = new Bot();

    const logFinal = final(app.log, (err, finalLogger) => {
        // finalLogger.error(err, "Error!");
        // * This is temporary for debugging!
        console.log("Error: " + err.stack);
        process.exit(1);
    });

    process.on("uncaughtException", logFinal);
    process.on("unhandledRejection", logFinal);
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
