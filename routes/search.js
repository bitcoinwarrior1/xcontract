let express = require('express');
let router = express.Router();
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);

router.get("/search", (req,res,next) =>
{
    res.render('search', {
        searchResults: ""
    });
});

router.get("/search/:dappname", (req,res,next) =>
{
    let arrayOfResultObjects = [];
    let dappName = req.params.dappname;

    knex("dAppTable").select().where("dappname" , "LIKE", "%" + dappName + "%").then( (data) =>
    {
        console.log(data);

        if(data == [])
        {
            console.log("no dApps found");

            res.render('search', {
                searchResults : "No dApps found"
            });

        }

        for(result of data)
        {
            console.log("dApps found");
            let resultObj = {};
            resultObj.dAppName = result.dAppName;
            resultObj.abi = result.abi;
            resultObj.contractAddress = result.contractAddress;

            arrayOfResultObjects.push(resultObj);
        }

        res.render('search', {
            searchResults : arrayOfResultObjects
        });

    })
    .catch((err) => {
        if(err) throw err;
    });
});

module.exports = router;