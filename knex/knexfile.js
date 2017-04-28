// Update with your config settings.
//TODO patch up and make dynamic
module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            //relative to index route
            filename: "./knex/dev.sqlite3"
        }
    },
    useNullAsDefault: true
};