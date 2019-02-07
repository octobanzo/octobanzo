#!/usr/bin/env node

const args = process.argv.slice(2);

if (!process.env["NODE_ENV"] && args.length < 1) {
    console.error("Please specify environment");
    return process.exit(1);
} else if (args.length > 0) {
    process.env["NODE_ENV"] = args[0].toLowerCase();
    require("./bin/base").run();
} else {
    process.env["NODE_ENV"] = "production";
    require("./bin/base").run();
}