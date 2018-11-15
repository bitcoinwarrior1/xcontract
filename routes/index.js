let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/llyrtzQ3YhkdESt2Fzrk'));
const DB_DAPP_TABLE = 'dapptable';
const etherscanErrorMsg = "NOTOK";
const verifiedOnEtherscanMsg = "Contract verified on Etherscan";

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

function getRenderObjectDetails(contractAddress, abi, url)
{
    let abiFunctions = web3Handler.extractAbiFunctions(abi);
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //keep track of all the contracts being used here
    logContactInteraction(new Date().getTime(), contractAddress);
    //add dapp into db so that user doesn't need to type the abi string anymore
    addDappToDatabase(abi, contractAddress);
    return {
        abiVal: JSON.stringify(abi), //this is a bit dangerous, but without strong types hard to do better
        addressVal: contractAddress,
        functionNames: functionNameAndParamObj.names,
        functionParams: functionNameAndParamObj.params,
        functionTitle: "Smart Contract Functions",
        readOnlyAttribute: functionNameAndParamObj.readOnly,
        url: url,
        warning: "Contract is not verified on Etherscan"
    };
}

router.get("/api/:contractAddress", (req, res, next) =>
{
    let contractAddress = req.params.contractAddress;
    let url = req.protocol + "://" + req.get('host') + "/api/" + contractAddress;
    let isInDB = false;
    let renderObj = {
        abiError: "PLEASE PASTE ABI HERE",
        addressVal: contractAddress,
        functionTitle: "Smart Contract Functions",
        warning: "NO ABI FOUND",
    };
    getDappDataFromDB(contractAddress, (result) => {
        if(result[0] != undefined)
        {
            let abi = result[0].abi;
            let contractAddress = result[0].contractAddress;
            renderObj = getRenderObjectDetails(contractAddress, abi, url);
            isInDB = true;
        }
        // can still get details if verified on etherscan
        web3Handler.checkIfContractIsVerified(contractAddress, (err, data) => {
            if(data.body.message === etherscanErrorMsg)
            {
                res.render('index', renderObj);
            }
            else
            {
                renderObj = getRenderObjectDetails(contractAddress, JSON.parse(data.body.result), url);
                renderObj.warning = verifiedOnEtherscanMsg;
            }
            res.render('index', renderObj);
        });

    });
});

//only for mainnet for now
function addDappToDatabase(abi, contractAddress)
{
    let contract = web3.eth.contract(abi).at(contractAddress);
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
router.get('/api/:abi/:address', (req, res, next) =>
{
    //parameters
    let abi = JSON.parse(req.params.abi);
    let contractAddress = req.params.address;
    //sets up function calls to contract from UI
    web3Handler.checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(err)
        {
            //TODO handle properly
            res.redirect("/");
        }
        //since the contract has been logged to the db, it can be shared without abi
        let url = req.protocol + "://" + req.get('host') + "/api/" + contractAddress;
        let renderObj = getRenderObjectDetails(contractAddress, abi, url);
        if(data.body.message !== etherscanErrorMsg)
        {
            renderObj.warning = verifiedOnEtherscanMsg;
        }
        res.render('index', renderObj);
    });
});


module.exports = router;
