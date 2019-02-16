#!/usr/bin/env node

const args = process.argv.slice(2);
const run = require("./bin/base").run;
const debug = require("debug")("runner:initial");

(() => {
    debug("App started.");
    require("source-map-support").install({
        emptyCacheBetweenOperations: true,
        environment: "node"
    });
    debug("Enabled source map support for stack traces.");

    if (args.length > 0) { // override NODE_ENV if passed as argument
        process.env.NODE_ENV = args[0].toLowerCase();
    } else if (!process.env.NODE_ENV) {
        console.error("ERROR: Please specify node environment! Set NODE_ENV environment variable or supply as first argument.");
        return process.exit(1);
    }

    debug("Initialization completed. Running");
    return run();
})(); // Please keep wrapped. Exposed JS is a crime!