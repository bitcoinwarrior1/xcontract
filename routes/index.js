//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

//TODO handle button clicks for submitting ABI and executing functions
//TODO handle function execution

//set the provider to metamask testnet, if user doesn't have metamask go to default localhost for ethereum
web3.setProvider(new web3.providers.HttpProvider(provider));

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'ContractExecutor' });
});

//handle user giving abi in url param
router.get('/api/:abi/:address', (req,res,next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
    //function and param names
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //sets up function calls to contract from UI

    res.render('index', {
        abiVal: JSON.stringify(abiJson),
        addressVal: contractAddress,
        functionNames: functionNameAndParamObj.names,
        functionParams : functionNameAndParamObj.params,
        statusLabel: "Network: " + provider
    });

});

router.get("/function/:functionInfo/:abi/:address", (req,res,next) => {
    //handle function calls here by handling button clicks
    res.send("nothing here yet!");
});

module.exports = router;
