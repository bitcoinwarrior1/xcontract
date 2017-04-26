//Globals:
let express = require('express');
let router = express.Router();
let knex = require('knex');

router.get("/search/:dappname", (req,res,next) =>
{
    let arrayOfResultObjects = [];

    knex.select().table("dAppTable").then(function(err,data) {
        if(err) throw err;

        for(result of data)
        {
            let resultObj = {};
            resultObj.dAppName = data.dAppName;
            resultObj.abi = data.abi;
            resultObj.contractAddress = data.contractAddress;

            arrayOfResultObjects.push(resultObj);
        }
    });

    //render all the items in a seperate div for each
    res.render('search', {
        searchResult : arrayOfResultObjects
    })
});

module.exports = router;