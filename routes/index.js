//Globals:
let express = require('express');
let router = express.Router();
let eth = require("../public/javascripts/eth.js");
//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

//TODO render methods from abi
//TODO handle button clicks
//TODO handle function execution

//set the provider to metamask testnet, if user doesn't have metamask go to default localhost for ethereum
web3.setProvider(new web3.providers.HttpProvider(provider));

/* GET home page. */
router.get('/', (req, res, next) =>
{
  res.render('index', { title: 'EtherExe' });
});

//handle user giving abi in url param
router.get('/abi/:abiString', (req,res,next) =>
{
    let abi = req.params.abiString;
    //let parsedAbi = abi.replace('""', "''").replace("%22", "''");
    let abiJson = JSON.parse(abi);

    console.log("Stringified json: " + JSON.stringify(abiJson));

    let abiFunctions = eth.extractAbiFunctions(abiJson);

    for(abiFunction of abiFunctions)
    {
        //create a jade element for each function in the abi
        res.append("#" + abiFunction.name, abiFunction);
        console.log(abiFunction.name);
    }

    res.render('index', { ABI: abiJson });
});

module.exports = router;
