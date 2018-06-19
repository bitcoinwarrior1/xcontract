let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

router.get("/api/:contractAddress", (req, res, next) =>
{
    let contractAddress = req.params.contractAddress;
    web3Handler.checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(err)
        {
            //TODO handle properly
            res.redirect("/");
        }
        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiError: "PLEASE PASTE ABI HERE",
                addressVal: contractAddress,
                functionTitle:"Smart Contract Functions",
                warning:"NO ABI FOUND AS CONTRACT IS NOT VERIFIED ON ETHERSCAN",
            });
        }
        else
        {
            res.redirect('/api/' + data.body.result + "/" + contractAddress);
        }
    });
});
//knex.insert([{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}], 'id').into('books')

function logContactInteraction(timestamp, contractAddress)
{
    knex("log-table").insert(
        {timestamp: timestamp},
        {contractAddress: contractAddress}
        ).then( (data) => {
        console.log("logged at " + timestamp + "with contract: " + contractAddress);
        console.log("Record number: " + data);
    })
}

//handle user giving abi in url param
router.get('/api/:abi/:address', (req, res, next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
    //function and param names
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //sets up function calls to contract from UI
    web3Handler.checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(err)
        {
            //TODO handle properly
            res.redirect("/");
        }
        //keep track of all the contracts being used here
        logContactInteraction(new Date().getTime(), contractAddress);

        let url = req.protocol + "://" + req.get('host') + req.originalUrl;

        let renderObj = {
            abiVal: JSON.stringify(abiJson),
            addressVal: contractAddress,
            functionNames: functionNameAndParamObj.names,
            functionParams : functionNameAndParamObj.params,
            functionTitle:"Smart Contract Functions",
            readOnlyAttribute: functionNameAndParamObj.readOnly,
            url: url
        };

        if(data.body.message === "NOTOK")
        {
            renderObj.warning = "Warning! Contract source code is not verified on etherscan!";
            res.render('index', renderObj);
        }
        else
        {
            renderObj.warning = "Contract source code is verified on etherscan!";
            //if verified can give shortened url without abi
            renderObj.url = req.protocol + "://" + req.get('host') + "/api/" + contractAddress;
            res.render('index', renderObj);
        }
    });

});


module.exports = router;
