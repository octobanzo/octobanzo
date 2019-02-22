#!/usr/bin/env node

import { debug as debugLib } from "debug";
import { run } from "./base";

const args = process.argv.slice(2);
const debug = debugLib("runner:initial");

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

debug("Initialization completed. Running");
run();
