exports.seed = function(knex, Promise)
{
    return Promise.join(
        // Deletes ALL existing entries
        knex('dAppTable').del(),
        // Inserts seed entries
        knex('dAppTable').insert({dAppName: 'OpenRep',
        abi: '[{"constant":false,"inputs":[{"name":"vendor","type":"address"}],' +
        '"name":"trade","outputs":[],"payable":false,"type":"function"},{"constant":false,' +
        '"inputs":[{"name":"username","type":"string"},{"name":"location","type":"string"}],' +
        '"name":"addUser","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},' +
        '{"constant":false,"inputs":[{"name":"vendor","type":"address"},{"name":"isPositive","type":"bool"},' +
        '{"name":"message","type":"string"}],"name":"giveReputation","outputs":[],"payable":false,"type":"function"}' +
        ',{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"viewReputation",' +
        '"outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},' +
        '{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},' +
        '{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user",' +
        '"type":"address"},{"indexed":true,"name":"message","type":"string"}],"name":"_positiveReputation",' +
        '"type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":true,' +
        '"name":"message","type":"string"}],"name":"_negativeReputation","type":"event"},{"anonymous":false,"inputs":' +
        '[{"indexed":true,"name":"username","type":"string"},{"indexed":true,"name":"location","type":"string"},' +
        '{"indexed":true,"name":"user","type":"address"}],"name":"_addUser","type":"event"},{"anonymous":false,' +
        '"inputs":[{"indexed":true,"name":"vendor","type":"address"},{"indexed":true,"name":"buyer","type":"address"}],' +
        '"name":"_newTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},' +
        '{"indexed":true,"name":"positive","type":"uint256"},{"indexed":true,"name":"negative","type":"uint256"},' +
        '{"indexed":false,"name":"total","type":"uint256"},{"indexed":false,"name":"burnedEth","type":"uint256"}' +
        ',{"indexed":false,"name":"burnedCoins","type":"uint256"}],"name":"_viewedReputation","type":"event"}]',
            contractAddress: "0x706af303364dc89a6b8dba265947442b05e84776"})
    );
};