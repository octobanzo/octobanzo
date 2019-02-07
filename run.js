#!/usr/bin/env node

(() => {
    const args = process.argv.slice(2);
    const run = require("./bin/base").run;

    if (!process.env.NODE_ENV && args.length === 0) {
        console.error("ERR: Please specify node environment! Set NODE_ENV environment variable or supply as first argument.");
        return process.exit(1);
    } else if (args.length > 0) {
        process.env["NODE_ENV"] = args[0].toLowerCase();
        return run();
    } else {
        process.env["NODE_ENV"] = "production";
        return run();
    }
})(); // Please keep wrapped. Exposed JS is a crime!