//Globals:
let express = require('express');
let router = express.Router();
let knex = require('knex');

router.get("/search/", (req,res,next) =>
{
    res.render('search', {
        // searchResult: "Welcome to search"
    });
});

router.get("/search/:dappname", (req,res,next) =>
{
    let arrayOfResultObjects = [];
    let dappName = req.params.dappname;

    knex.select().table("dAppTable").whereRaw("dAppName = " + dappName).then(function(err,data) {
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
    });
});

module.exports = router;