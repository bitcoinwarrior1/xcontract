//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/eth.js");
//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

//TODO render methods from abi
//TODO handle button clicks
//TODO handle function execution
//TODO add register and search

//set the provider to metamask testnet, if user doesn't have metamask go to default localhost for ethereum
web3.setProvider(new web3.providers.HttpProvider(provider));

/* GET home page. */
router.get('/', (req, res, next) =>
{
  res.render('index', { title: 'EtherExe' });
});

//handle user giving abi in url param
router.get('/api/:abi/:address', (req,res,next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;

    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);

    for(abiFunction of abiFunctions)
    {
        //create a jade element for each function in the abi
        //var functionElement = res.createElement("#" + abiFunction.name);
        let params = abiFunction.inputs;
        //sets the param requirements hint in a new input text element
        //var requiredParamsTextBox = res.createElement("#requiredParams");

        console.log(abiFunction.name);
    }

    res.render('index', { abiVal: JSON.stringify(abiJson),
        addressVal: contractAddress });
});

module.exports = router;
