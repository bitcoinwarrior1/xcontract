//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/eth.js");
//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

//TODO handle button clicks for submitting ABI and executing functions
//TODO handle function execution
//TODO add register and search
//TODO patch up frontend index.jade

//set the provider to metamask testnet, if user doesn't have metamask go to default localhost for ethereum
web3.setProvider(new web3.providers.HttpProvider(provider));

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'EtherExe' });
});

//handle user giving abi in url param
router.get('/api/:abi/:address', (req,res,next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);

    let functionNameFields = [];
    let functionParamFields = [];

    for(abiFunc of abiFunctions)
    {
        let functionName = abiFunc.name;
        let functionParams = JSON.stringify(abiFunc.inputs[0]);
        //create jade elements for each function with name and param
        functionNameFields.push(functionName);
        functionParamFields.push(functionParams);
    }

    res.render('index', {
        abiVal: JSON.stringify(abiJson),
        addressVal: contractAddress,
        functionNames: JSON.stringify(functionNameFields),
        functionParams : functionParamFields,
        statusLabel: "Welcome!"
    });

});

router.get("/function/:functionInfo/:abi/:address", (req,res,next) => {
    //handle function calls here by handling button clicks
});


module.exports = router;
