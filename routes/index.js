//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/eth.js");
//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

//TODO render methods from abi
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

    let i = 1;
    let functionNameFields = [];
    let functionParamFields = [];

    for(abiFunc of abiFunctions)
    {
        let functionName = abiFunc.name;
        let functionParams = JSON.stringify(abiFunc.inputs[0]);
        //create jade elements for each function with name and param
        // functionNameFields += "button#functionButton" + i + "(value=" + functionName + ")";
        // functionParamFields += "input#paramBox(placeholder=" + functionParams + ")";
        functionNameFields.push(functionName);
        functionParamFields.push(functionParams);
        i++;
    }
    //TODO make dynamic after testing
    res.render('index', {
        abiVal: JSON.stringify(abiJson),
        addressVal: contractAddress,
        functionName: JSON.stringify(functionNameFields[0]),
        paramVals : functionParamFields[0],
        functionName2: JSON.stringify(functionNameFields[1]),
        paramVals2 : functionParamFields[1],
        functionName3: JSON.stringify(functionNameFields[2]),
        paramVals3 : functionParamFields[2],
        functionName4: JSON.stringify(functionNameFields[3]),
        paramVals4 : functionParamFields[3],
        functionName5: JSON.stringify(functionNameFields[4]),
        paramVals5 : functionParamFields[4],
        functionName6: JSON.stringify(functionNameFields[5]),
        paramVals6 : functionParamFields[5],
        functionName7: JSON.stringify(functionNameFields[6]),
        paramVals7 : functionParamFields[6],
        functionName8: JSON.stringify(functionNameFields[7]),
        paramVals8 : functionParamFields[7],
        functionName9: JSON.stringify(functionNameFields[8]),
        paramVals9 : functionParamFields[8],
        functionName10: JSON.stringify(functionNameFields[9]),
        paramVals10 : functionParamFields[9],
        statusLabel: "Welcome!"
    });

});

router.get("/function/:functionInfo/:abi/:address", (req,res,next) => {
    //handle function calls here by handling button clicks
});


module.exports = router;
