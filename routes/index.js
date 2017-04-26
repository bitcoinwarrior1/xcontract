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
router.get('/api/:abi/:address', (req,res,next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
    //function and param names
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //sets up function calls to contract from UI

    // res.render('index', {
    //     abiVal: JSON.stringify(abiJson),
    //     addressVal: contractAddress,
    //     functionNames: functionNameAndParamObj.names,
    //     functionParams : functionNameAndParamObj.params,
    //     functionTitle:"Smart Contract Functions"
    // });

    checkIfContractIsVerified(contractAddress, functionNameAndParamObj, abiJson, res)

});

function checkIfContractIsVerified(contractAddress, functionNameAndParamObj, abiJson, res)
{
    let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

    request.get(etherScanApi + contractAddress, (error, data) =>
    {
        if(error) throw error;

        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiVal: JSON.stringify(abiJson),
                addressVal: contractAddress,
                functionNames: functionNameAndParamObj.names,
                functionParams : functionNameAndParamObj.params,
                functionTitle:"Smart Contract Functions",
                warning:"Warning! Contract source code is not verified!"
            });
        }
        else
        {
            res.render('index', {
                abiVal: JSON.stringify(abiJson),
                addressVal: contractAddress,
                functionNames: functionNameAndParamObj.names,
                functionParams : functionNameAndParamObj.params,
                functionTitle:"Smart Contract Functions",
                warning:"Contract source code is verified!"
            });
        }
    });
}


module.exports = router;
