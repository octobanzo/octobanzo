const args = process.argv.slice(2);

function run(): void {
    console.info("INIT: App started.");

    console.info("INIT: Checking environment...");
    // override NODE_ENV if passed as argument
    if (args.length > 0) {
        process.env.NODE_ENV = args[0].toLowerCase();
    } else if (!process.env.NODE_ENV) {
        console.error("INIT.ERROR: Please specify environment! Set NODE_ENV or supply environment as first argument.");
        process.exit(1);
    }
    console.info("INIT: Environment OK. " + process.env.NODE_ENV);

    process.env.NODE_CONFIG_ENV = process.env.NODE_ENV;

    // Add source map logging if 'development'
    if (process.env.NODE_ENV === "development") {
        console.info("INIT: Implementing source map logging.");
        require("source-map-support").install({
            environment: "node"
        });
        console.info("INIT.DEBUG: Enabled source map logging for stack traces.");
    }

    console.log("INIT: Initialization completed. Running...");

    require("./base").start();

    console.log("INIT: Initial");
}

run();
