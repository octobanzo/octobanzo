#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error("Please specify environment");
    process.exit(1);
} else {
    process.env["NODE_ENV"] = args[0];
    require("./bin/bot").run();
}