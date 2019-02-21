#!/usr/bin/env node

const args = process.argv.slice(2);
const run;
const debug = require("debug")("runner:initial");

(() => {
    debug("App started.");

    try {
        run = require("./bin/base").run;
    } catch (err) {
        console.error("ERROR: There's nothing to run! Please run tsc to compile source before running.");
    }

    if (args.length > 0) { // override NODE_ENV if passed as argument
        process.env.NODE_ENV = args[0].toLowerCase();
    } else if (!process.env.NODE_ENV) {
        console.error("ERROR: Please specify node environment! Set NODE_ENV environment variable or supply as first argument.");
        return process.exit(1);
    }

    if (process.env.NODE_ENV === "development") {
        require("source-map-support").install({
            environment: "node"
        });
        debug("Enabled source map support for stack traces.");
    }

    debug("Initialization completed. Running");
    return run();
})(); // Please keep wrapped. Exposed JS is a crime!
