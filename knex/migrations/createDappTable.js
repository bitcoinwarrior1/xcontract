exports.up = function(knex, Promise)
{
    console.log('create dApp table');

    return knex.schema.createTableIfNotExists('dapptable', function(table)
    {
        table.increments('id');
        table.string('dappName').unique();
        table.string('contractAddress').unique();
        table.json('abi');
    })
};

exports.down = function(knex, Promise)
{
    return knex.schema.dropTableIfExists('dapptable').then(function ()
    {
        console.log('dapptable table was dropped');
    })
};