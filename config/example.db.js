// Rename this file to `db.js` and throw all your values into it!

module.exports = {

    development: {
        client: 'mysql2',
        connection: {
            host: 'your_host',
            database: 'octobanzo',
            user: 'octobanzo',
            password: 'oct0b4nz0!',
            charset: 'utf8'
        },
        migrations: {
            directory: __dirname + '/../bin/migrations',
        },
        seeds: {
            directory: __dirname + '/../bin/seeds'
        }
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: __dirname + '/../bin/migrations',
        },
        seeds: {
            directory: __dirname + '/../bin/seeds'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: __dirname + '/../bin/migrations',
        },
        seeds: {
            directory: __dirname + '/../bin/seeds'
        }
    }

}
