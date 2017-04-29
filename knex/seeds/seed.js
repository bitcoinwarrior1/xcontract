exports.seed = function(knex, Promise)
{
    return Promise.join(
        // Deletes ALL existing entries
        knex('dapptable').del(),
        // Inserts seed entries
        knex('dapptable').insert({dappname: 'FoundationTipJar', contractaddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"})
    );
};