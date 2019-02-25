import Bot from "./lib/bot";
import Logger from "./lib/logging";

const args = process.argv.slice(2);

function start(): void {
    console.info("INIT: App started.");

    // override NODE_ENV if passed as argument
    if (args.length > 0) {
        process.env.NODE_ENV = args[0].toLowerCase();
    } else if (!process.env.NODE_ENV) {
        console.error("INIT.ERROR: Please specify environment! Set NODE_ENV or supply environment as first argument.");
        process.exit(1);
    }

    // Add source map logging if 'development'
    if (process.env.NODE_ENV === "development") {
        require("source-map-support").install({
            environment: "node"
        });
        console.info("INIT.DEBUG: Enabled source map support for stack traces.");
    }

    const app = new Bot();

    process.on("uncaughtException", app.log.error);
    process.on("unhandledRejection", app.log.warn);
    process.on("SIGINT", () => shutdown(app));

    app.log.debug("Initialization completed. Running");
}

function shutdown(app: Bot): never {
    app.log.info("Shutting down...");
    try {
        app.log.debug("Destroying client");
        app.client.destroy();
        app.log.debug("Client destroyed.");
        return process.exit(0);
    } catch (err) {
        return process.exit(1);
    }
}

start();
