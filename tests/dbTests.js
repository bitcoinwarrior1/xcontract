// let test = require("tape");
// let knexConfig = require('../knex/knexfile');
// let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);
//
// test("should retrieve FoundationTipJar dApp entry", function(t)
// {
//     knex.table("dapptable").select().where("dappname","FoundationTipJar")
//         .then((data) => {
//             t.doesNotEqual(typeof (data) != undefined, typeof (data) , "should not be an empty array");
//         })
//         .catch((err) =>
//         {
//             if(err) throw err;
//         });
//     t.end();
// });
//
