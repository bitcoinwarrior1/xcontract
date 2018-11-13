/**
 * Created by sangalli on 14/11/18.
 */
exports.seed = function(knex, Promise)
{
    return Promise.join(
        // Deletes ALL existing entries
        knex('log-table').del(),
        // Inserts seed entries
        knex("log-table").insert(
            {
                timestamp: new Date().getTime(),
                contractAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"
            }
        )
    );
};