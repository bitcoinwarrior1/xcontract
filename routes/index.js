//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
let request = require("superagent");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

//handle user giving abi in url param
router.get('/api/:address', (req,res,next) => {

    //parameters
    let contractAddress = req.params.address;
    let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

    request.get(etherScanApi + contractAddress, (error, data) =>
    {
        if(error) throw error;

        let abiJson = JSON.parse(data.body.result);
        //let abiJson = web3Handler.getAbiFromContractAddress(contractAddress);
        console.log(abiJson);
        let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
        //function and param names
        let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
        //sets up function calls to contract from UI

        res.render('index', {
            abiVal: JSON.stringify(abiJson),
            addressVal: contractAddress,
            functionNames: functionNameAndParamObj.names,
            functionParams : functionNameAndParamObj.params,
            functionTitle:"Smart Contract Functions"
        });
    });

});


module.exports = router;
