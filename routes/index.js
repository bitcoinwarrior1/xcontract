let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/llyrtzQ3YhkdESt2Fzrk'));
const DB_DAPP_TABLE = 'dapptable';
const etherscanErrorMsg = "NOTOK";

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

router.get("/api/:contractAddress", (req, res, next) =>
{
    let contractAddress = req.params.contractAddress;
    getDappDataFromDB(contractAddress, (result) => {
        console.log("result type: " + typeof  result[0] + " address: " + result[0].contractAddress);
        if(result[0] != undefined)
        {
            res.redirect('/api/' + JSON.stringify(result[0].abi) + "/" + result[0].contractAddress);
        }
    });

    web3Handler.checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(err)
        {
            //TODO handle properly
            res.redirect("/");
        }
        else if(data.body.message === etherscanErrorMsg)
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

//only for mainnet for now
function addDappToDatabase(abi, contractAddress)
{
    let contract = web3.eth.contract(JSON.parse(abi)).at(contractAddress);
    let dappObj = {
        dappName: contractAddress,
        contractAddress: contractAddress,
        abi: abi
    };
    web3Handler.getName(contract, (err, name) => {
        if(!err) {
            dappObj.dappName = name;
        }
        knex(DB_DAPP_TABLE).insert(dappObj).then((data) => {

        }).catch((err) => {

        });
    });
}

function getDappDataFromDB(contractAddress, cb)
{
    knex(DB_DAPP_TABLE).select().where({ contractAddress: contractAddress }).then((data) => {
        cb(data);
    }).catch((err) => {
        cb(err);
    });
}

function logContactInteraction(timestamp, contractAddress)
{
    knex("log-table").insert({
        timestamp: timestamp,
        contractAddress: contractAddress
    }).then( (data) => {
        console.log("logged at " + timestamp + " with contract: " + contractAddress);
        console.log("Record number: " + data);
    });
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

        //add dapp into db so that user doesn't need to type the abi string anymore
        addDappToDatabase(abi, contractAddress);

        if(data.body.message === etherscanErrorMsg)
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
