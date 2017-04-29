// Update with your config settings.
//TODO patch up and make dynamic
module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            //relative to index route
            filename: __dirname + "/dev.sqlite3"
        }
    },
    useNullAsDefault: true,

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            //tableName: 'dAppTable',
            directory: __dirname + '/migrations'
        },
        seeds: {
            directory: __dirname + '/seeds'
        }
    }
};