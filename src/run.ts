/* tslint:disable:no-require-imports */

const args = process.argv.slice(2);

(
    function run(): void {
        // override NODE_ENV if passed as argument
        (args.length) &&
            (process.env.NODE_ENV = args[0].toLowerCase());

        if (!process.env.NODE_ENV) {
            console.error('[ERR!] Please specify environment! Set NODE_ENV or supply environment as first argument.');
            process.exit(1);
        }

        console.info('[INIT] Environment: ' + process.env.NODE_ENV);

        // Add source map logging if 'development'
        (process.env.NODE_ENV === 'development') &&
            require('source-map-support').install({
                environment: 'node'
            });

        require('./base').start();
    }
)()
