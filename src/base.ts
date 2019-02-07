"use strict";

import * as config from "config";
import { BotApp } from "./lib/bot";

let app: BotApp;

export function run() {
    // Create a new bot
    app = new BotApp();

    // Graceful shutdown register
    process.on("SIGINT", shutdown);

    app.client.on("error", () => {

    });

    return 0;
}

async function shutdown() {
    console.info("Shutting down");

    // Set bot offline/invisible and destroy it
    await app.client.user.setStatus("invisible");
    await app.client.destroy();

    return process.exit(0);
}