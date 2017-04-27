exports.up = function(knex, Promise)
{
    console.log('create dApp table');

    return knex.schema.createTableIfNotExists('dAppTable', function(table)
    {
        table.increments('id');
        table.string('dAppName');
        table.string('abi');
        table.string('contractAddress');
    })
};

exports.down = function(knex, Promise)
{
    return knex.schema.dropTableIfExists('dAppTable').then(function ()
    {
        console.log('dAppTable table was dropped');
    })
};