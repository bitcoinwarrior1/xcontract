exports.up = function(knex, Promise)
{
    console.log('create log table');

    return knex.schema.createTableIfNotExists('log-table', function(table)
    {
        table.increments('id');
        table.string('timestamp');
        table.string('contractAddress');
    })
};

exports.down = function(knex, Promise)
{
    return knex.schema.dropTableIfExists('log-table').then(function ()
    {
        console.log('log-table table was dropped');
    })
};
