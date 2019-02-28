import Bot from "./lib/bot";

export function start(): void {
    console.info("INIT.BASE: Starting bot...");

    const app = new Bot();

    process.on("uncaughtException", console.error);
    process.on("unhandledRejection", console.error);
    process.on("SIGINT", () => shutdown(app));

    console.log("INIT: Initial");
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
